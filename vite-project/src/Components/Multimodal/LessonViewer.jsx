import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, ChevronRight, ChevronLeft,
  BookOpen, Brain, FileText, Send, CheckCircle2, Clock, MessageCircle, Languages,
  RotateCcw, Sparkles, Lock, X, Cuboid, Edit
} from 'lucide-react';

import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { API_BASE_URL } from '../../config/apiConfig';
import NavbarWithDrawer from '../NavDrawer';
import YouTube from 'react-youtube';
import Swal from 'sweetalert2';
import ModelViewer from './ModelViewer';

const LessonViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const isTeacher = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'superadmin';

    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [videoCompleted, setVideoCompleted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showAiSubtitles, setShowAiSubtitles] = useState(false);
    
    // AI & Chat
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);

    // Discussion
    const [discussionMessages, setDiscussionMessages] = useState([]);
    const [discussionInput, setDiscussionInput] = useState('');
    const discussionEndRef = useRef(null);

    // Layout State
    const [activeTab, setActiveTab] = useState('3d');
    const [nextLesson, setNextLesson] = useState(null);

    const playerRef = useRef(null);
    const lastTimeRef = useRef(0);

    // Audio & TTS
    const [ttsSpeed, setTtsSpeed] = useState(1);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const toggleSpeech = () => {
        if (!('speechSynthesis' in window)) {
            Swal.fire({ icon: 'error', title: 'Xatolik', text: 'Brauzeringiz matn o\'qishni qo\'llab-quvvatlamaydi.' });
            return;
        }

        if (isSpeaking) {
            if (isPaused) {
                window.speechSynthesis.resume();
                setIsPaused(false);
            } else {
                window.speechSynthesis.pause();
                setIsPaused(true);
            }
        } else {
            const textToRead = lesson.textContent || lesson.description;
            if (!textToRead) return;

            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.lang = 'uz-UZ';
            utterance.rate = ttsSpeed;
            
            utterance.onend = () => {
                setIsSpeaking(false);
                setIsPaused(false);
            };
            
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
            setIsPaused(false);
        }
    };

    useEffect(() => {
        fetchLesson();
        fetchDiscussion();
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, [id]);

    const fetchLesson = async () => {
        try {
            setLoading(true);
            const headers = user?.token ? { 'x-auth-token': user.token } : {};
            console.log('Fetching lesson with ID:', id);
            const res = await axios.get(`${API_BASE_URL}/lessons/${id}`, { headers });
            console.log('Lesson data received:', res.data);
            setLesson(res.data);
            
            if (res.data.viewedBy && res.data.viewedBy.includes(user?._id)) {
                setVideoCompleted(true);
            }
            
            if (res.data.course) {
                const courseId = typeof res.data.course === 'object' ? res.data.course._id : res.data.course;
                console.log('Detected course ID:', courseId);
                
                if (courseId && courseId !== 'null' && courseId !== 'undefined' && courseId !== id) {
                    try {
                        const courseRes = await axios.get(`${API_BASE_URL}/courses/${courseId}`, { headers });
                        console.log('Course data received:', courseRes.data);
                        const lessons = courseRes.data.lessons || [];
                        const currentIndex = lessons.findIndex(l => (l._id || l) === id);
                        if (currentIndex >= 0 && currentIndex < lessons.length - 1) {
                            setNextLesson(lessons[currentIndex + 1]);
                        } else {
                            setNextLesson(null);
                        }
                    } catch (courseErr) {
                        console.error('Error fetching course info:', courseErr);
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching lesson:', err);
            Swal.fire({
                icon: 'error',
                title: 'Xatolik',
                text: 'Darsni yuklashda xatolik yuz berdi. Iltimos, qaytadan urunib ko\'ring.'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchDiscussion = async () => {
        try {
            const headers = user?.token ? { 'x-auth-token': user.token } : {};
            const res = await axios.get(`${API_BASE_URL}/messages/${id}`, { headers });
            setDiscussionMessages(res.data);
            scrollToBottom();
        } catch (err) {
            console.error('Error fetching discussion:', err);
        }
    };

    const markAsViewed = async () => {
        try {
            if(user && user.token) {
                await axios.post(`${API_BASE_URL}/lessons/${id}/view`, {}, {
                    headers: { 'x-auth-token': user.token }
                });
            }
        } catch(err) {}
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            discussionEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const onPlayerReady = (event) => {
        setDuration(event.target.getDuration());
        playerRef.current = event.target;
    };

    useEffect(() => {
        let interval;
        if (isPlaying && playerRef.current) {
            interval = setInterval(() => {
                const newTime = playerRef.current.getCurrentTime();
                
                // Prevent seeking forward
                if (!videoCompleted && !isTeacher) {
                    if (newTime > lastTimeRef.current + 2) {
                        playerRef.current.seekTo(lastTimeRef.current);
                        Swal.fire({
                            title: "O'tkazib bo'lmaydi",
                            text: "Darsni to'liq ko'rishingiz kerak",
                            icon: "warning",
                            timer: 1500,
                            showConfirmButton: false,
                            toast: true,
                            position: 'top-end'
                        });
                    } else if (newTime > lastTimeRef.current) {
                        lastTimeRef.current = newTime;
                    }
                }
                
                setCurrentTime(newTime);
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, videoCompleted, isTeacher, id]);

    const onPlayerStateChange = (event) => {
        if (event.data === 1) setIsPlaying(true);
        else setIsPlaying(false);
        
        if (event.data === 0) { // ENDED
            setVideoCompleted(true);
            if (!lesson.quiz || lesson.quiz.length === 0) {
                markAsViewed();
            }
        }
    };

    const handleSendChatMessage = async () => {
        if(!chatInput.trim()) return;
        const newMsg = { role: 'user', text: chatInput };
        setMessages([...messages, newMsg]);
        setChatInput('');
        setIsChatLoading(true);
        const currentHistory = [...messages, newMsg].map(m => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.text }]
        }));

        try {
            const res = await axios.post(`${API_BASE_URL}/ai/chat`, { 
                contents: currentHistory,
                systemContext: `Siz MultiEdu o'quv platformasining aqlli AI Tyutorisiz. 
                Hozirgi dars mavzusi: "${lesson?.title}". 
                Dars matni: "${lesson?.textContent || lesson?.description || ''}".`
            });
            const aiText = res.data.candidates[0].content.parts[0].text;
            setMessages(prev => [...prev, { role: 'model', text: aiText }]);
        } catch(err) {
            setMessages(prev => [...prev, { role: 'model', text: 'Kechirasiz, xatolik yuz berdi.' }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    async function handleSendDiscussion() {
        if (!discussionInput.trim() || !user) return;
        try {
            const payload = { lessonId: id, text: discussionInput };
            const res = await axios.post(`${API_BASE_URL}/messages`, payload, {
                headers: { 'x-auth-token': user.token }
            });
            setDiscussionMessages([...discussionMessages, res.data]);
            setDiscussionInput('');
            scrollToBottom();
        } catch (err) {}
    }

    if (loading) {
        return (
            <NavbarWithDrawer>
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </NavbarWithDrawer>
        );
    }

    if (!lesson) return null;

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(lesson.videoUrl);
    
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Parse transcript with [MM:SS] markers for precise sync
    const getActiveSubtitle = () => {
        if (!lesson?.transcript) return "";
        
        // Regex to find [MM:SS] markers and the text following them
        const regex = /\[(\d{1,2}):(\d{2})\]\s*([^\[\n]+)/g;
        const timedSegments = [];
        let match;
        
        while ((match = regex.exec(lesson.transcript)) !== null) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const time = minutes * 60 + seconds;
            const text = match[3].trim();
            timedSegments.push({ time, text });
        }

        if (timedSegments.length > 0) {
            // Find the active segment based on currentTime
            let activeText = "";
            for (let i = 0; i < timedSegments.length; i++) {
                if (currentTime >= timedSegments[i].time) {
                    activeText = timedSegments[i].text;
                } else {
                    break;
                }
            }
            return activeText;
        }
        
        // Fallback to sentence-based heuristic if no time markers are found
        if (!duration) return "";
        const sentences = lesson.transcript.split(/(?<=[.!?])\s+/).filter(s => s.trim());
        if (sentences.length === 0) return "";
        
        const segmentDuration = duration / sentences.length;
        const currentSegmentIndex = Math.floor(currentTime / segmentDuration);
        
        return sentences[currentSegmentIndex] || "";
    };

    const hasQuiz = lesson.quiz && lesson.quiz.length > 0;
    const hasPassedQuiz = lesson.viewedBy?.includes(user?._id) || isTeacher;

    return (
        <NavbarWithDrawer>
            <div className="min-h-screen bg-[#f8fafc] dark:bg-background pb-20">
                <main className="max-w-6xl mx-auto px-4 lg:px-6 py-4">
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Left Column: Video & Metadata */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Video Player */}
                            <div className="relative bg-black rounded-3xl overflow-hidden aspect-video shadow-lg border border-border group">
                                {videoId ? (
                                    <YouTube
                                        videoId={videoId}
                                        opts={{
                                            height: '100%',
                                            width: '100%',
                                            playerVars: { 
                                                rel: 0, 
                                                modestbranding: 1,
                                                controls: 0, // Hiding YouTube controls to prevent clicking "Watch on YouTube"
                                                disablekb: 1,
                                                fs: 0,
                                                iv_load_policy: 3
                                            },
                                        }}
                                        onReady={onPlayerReady}
                                        onStateChange={onPlayerStateChange}
                                        className="w-full h-full absolute inset-0"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                                        <Play className="w-16 h-16 mb-4 opacity-20" />
                                        <p>Video mavjud emas</p>
                                    </div>
                                )}

                                {/* Transparent Overlay to block clicks on YouTube logo/links */}
                                <div className="absolute inset-0 z-[5] bg-transparent" onClick={() => {
                                    if (isPlaying) playerRef.current?.pauseVideo();
                                    else playerRef.current?.playVideo();
                                }} />

                                {/* Custom Progress Bar Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => isPlaying ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo()} className="text-white">
                                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                        </button>
                                        <div className="flex-1 h-1.5 bg-white/20 rounded-full relative overflow-hidden">
                                            <div 
                                                className="absolute left-0 top-0 bottom-0 bg-primary transition-all duration-300" 
                                                style={{ width: `${(currentTime / duration) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-white tabular-nums">
                                            {formatTime(currentTime)} / {formatTime(duration)}
                                        </span>
                                        <button 
                                            onClick={() => setShowAiSubtitles(!showAiSubtitles)} 
                                            className={`transition-colors ${showAiSubtitles ? 'text-primary' : 'text-white/60 hover:text-white'}`}
                                            title="AI Subtitrlar"
                                        >
                                            <Languages className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* AI Subtitles Overlay */}
                                <AnimatePresence>
                                    {showAiSubtitles && isPlaying && getActiveSubtitle() && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[8] w-[80%] text-center"
                                        >
                                            <span className="bg-black/60 backdrop-blur-md text-white px-6 py-2 rounded-xl text-sm md:text-base font-medium border border-white/10 shadow-xl inline-block">
                                                {getActiveSubtitle()}
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Lock Indicator */}
                                {!videoCompleted && (
                                    <div className="absolute top-4 left-4 z-10 pointer-events-none">
                                        <Badge className="bg-amber-500/90 hover:bg-amber-500 backdrop-blur-sm text-white border-0 shadow-lg gap-1.5 px-3 py-1 text-xs">
                                            <Lock className="w-3 h-3" />
                                            O'tkazish cheklangan
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Lesson Metadata */}
                            <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h1 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
                                                    {lesson.title}
                                                </h1>
                                                {isTeacher && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="w-8 h-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5"
                                                        onClick={() => navigate(`/lessons/edit/${id}`)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {lesson.course?.title || "Kurs"} • {lesson.module || "Modul"}, dars
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="w-fit text-sm px-4 py-1.5 font-bold bg-primary/10 text-primary">
                                            Ko'rilmoqda
                                        </Badge>
                                    </div>

                                <div className="py-6 border-t border-b border-border mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-lg text-foreground">Ma'ruza Matni</h3>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className={`rounded-xl ${isSpeaking && !isPaused ? 'text-white bg-primary border-primary' : 'text-primary border-primary/20 bg-primary/5 hover:bg-primary/10'}`}
                                            onClick={toggleSpeech}
                                        >
                                            {isSpeaking && !isPaused ? (
                                                <><Pause className="w-4 h-4 mr-2" /> To'xtatib turish</>
                                            ) : isPaused ? (
                                                <><Play className="w-4 h-4 mr-2" /> Davom etish</>
                                            ) : (
                                                <><Volume2 className="w-4 h-4 mr-2" /> Eshitish</>
                                            )}
                                        </Button>
                                    </div>
                                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground/90 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                                        <p className="whitespace-pre-wrap leading-relaxed">
                                            {lesson.textContent || lesson.description || "Ushbu dars uchun matn kiritilmagan."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Tabs */}
                        <div className="lg:col-span-4 h-[calc(100vh-100px)] sticky top-20 flex flex-col gap-4">
                            <div className="bg-card border border-border rounded-3xl flex-1 flex flex-col shadow-sm overflow-hidden">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col w-full h-full min-h-0">
                                    <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm z-10">
                                        <TabsList className="grid grid-cols-3 gap-2 w-full h-[54px] bg-secondary/40 p-1.5 rounded-full">
                                            <TabsTrigger value="3d" className="rounded-full text-xs sm:text-sm h-full data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:shadow-sm" disabled={!lesson.model3dUrl && !lesson.interactiveUrl}>
                                                <Cuboid className="w-4 h-4 mr-1.5" />
                                                <span>3D</span>
                                            </TabsTrigger>
                                            <TabsTrigger value="fayllar" className="rounded-full text-xs sm:text-sm h-full data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:shadow-sm">
                                                <FileText className="w-4 h-4 mr-1.5" />
                                                <span>Fayllar</span>
                                            </TabsTrigger>
                                            <TabsTrigger value="chat" className="rounded-full text-xs sm:text-sm h-full data-[state=active]:border-2 data-[state=active]:border-primary data-[state=active]:shadow-sm">
                                                <MessageCircle className="w-4 h-4 mr-1.5" />
                                                <span>Chat</span>
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                        <TabsContent value="3d" className="m-0 h-full">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-lg">3D Model</h3>
                                                <Badge variant="outline" className="bg-primary/5">AR Tayyor</Badge>
                                            </div>
                                            {(lesson.model3dUrl || lesson.interactiveUrl) ? (
                                                <div className="h-[300px] sm:h-[400px] w-full bg-secondary/30 rounded-2xl overflow-hidden border border-border">
                                                    <ModelViewer model={{ url: lesson.model3dUrl || lesson.interactiveUrl }} />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                                    <Cuboid className="w-12 h-12 mb-4 opacity-20" />
                                                    <p>Bu dars uchun 3D model yo'q</p>
                                                </div>
                                            )}
                                        </TabsContent>



                                        <TabsContent value="fayllar" className="m-0 space-y-4">
                                            <h3 className="font-bold text-lg mb-6">Qo'shimcha resurslar</h3>
                                            
                                            {lesson.documentUrl && (
                                                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl border border-border group hover:bg-secondary/50 transition-all cursor-pointer">
                                                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-foreground truncate">Dars taqdimoti</p>
                                                        <p className="text-xs text-muted-foreground">PDF Fayl</p>
                                                    </div>
                                                    <Button size="sm" variant="ghost" onClick={() => window.open(lesson.documentUrl)}>
                                                        Ochish
                                                    </Button>
                                                </div>
                                            )}

                                            {lesson.audioUrl && (
                                                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl border border-border group hover:bg-secondary/50 transition-all">
                                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                        <Volume2 className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-foreground truncate">Audio podkast</p>
                                                        <audio src={lesson.audioUrl} controls className="h-8 mt-2 w-full max-w-full" />
                                                    </div>
                                                </div>
                                            )}

                                            {!lesson.documentUrl && !lesson.audioUrl && (
                                                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                                    <FileText className="w-12 h-12 mb-4 opacity-20" />
                                                    <p>Qo'shimcha fayllar mavjud emas</p>
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="chat" className="m-0 h-full flex flex-col">
                                            <div className="flex items-center justify-between mb-4 shrink-0">
                                                <h3 className="font-bold text-lg">Umumiy Chat</h3>
                                                <Badge variant="secondary" className="bg-secondary">{discussionMessages.length} xabar</Badge>
                                            </div>
                                            
                                            <div className="flex-1 min-h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar mb-4">
                                                {discussionMessages.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm text-center px-4">
                                                        <MessageCircle className="w-10 h-10 mb-3 opacity-20" />
                                                        Hozircha xabarlar yo'q. Birinchi bo'lib fikr bildiring!
                                                    </div>
                                                ) : (
                                                    discussionMessages.map((msg) => (
                                                        <div key={msg._id} className={`flex gap-3 ${msg.sender?._id === user?._id ? 'flex-row-reverse' : ''}`}>
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                                                                {msg.sender?.name?.[0]}
                                                            </div>
                                                            <div className={`space-y-1 max-w-[85%] ${msg.sender?._id === user?._id ? 'items-end' : ''}`}>
                                                                <div className={`p-3 rounded-2xl text-sm ${
                                                                    msg.sender?._id === user?._id 
                                                                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                                                        : 'bg-secondary text-foreground rounded-tl-none'
                                                                }`}>
                                                                    {msg.text}
                                                                </div>
                                                                <p className="text-[10px] text-muted-foreground font-medium px-1 flex items-center gap-1.5 mt-1">
                                                                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                    <span>•</span>
                                                                    <span className={msg.sender?.role === 'teacher' || msg.sender?.role === 'admin' ? 'text-primary' : 'text-amber-500'}>
                                                                        {msg.sender?.role === 'teacher' || msg.sender?.role === 'admin' ? "O'qituvchi" : "O'quvchi"}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                                <div ref={discussionEndRef} />
                                            </div>
                                            
                                            <div className="pt-4 border-t border-border mt-auto shrink-0 bg-card">
                                                <div className="relative">
                                                    <input 
                                                        className="w-full bg-secondary/50 rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                                        placeholder="Xabar yozing..."
                                                        value={discussionInput}
                                                        onChange={(e) => setDiscussionInput(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSendDiscussion()}
                                                    />
                                                    <Button 
                                                        size="icon" 
                                                        className="absolute right-1 top-1 w-9 h-9 rounded-xl bg-primary text-white" 
                                                        onClick={handleSendDiscussion}
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm shrink-0">
                                <div className="flex flex-col xl:flex-row items-center justify-end gap-4 w-full">
                                    {hasQuiz && !hasPassedQuiz ? (
                                        <Button 
                                            className="rounded-[1.25rem] gap-2 bg-gradient-to-r from-[#6eb0f2] to-[#6ed2c5] hover:from-[#5ca6ee] hover:to-[#5cc3b5] border-none text-white w-full xl:w-auto px-8 h-12 shadow-md transition-all font-medium text-base"
                                            onClick={() => navigate(`/lessons/${id}/quiz`)}
                                            disabled={!videoCompleted && !isTeacher}
                                        >
                                            <BookOpen className="w-4 h-4 mr-1" />
                                            Testni boshlash
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    ) : nextLesson ? (
                                        <Button 
                                            className="rounded-[1.25rem] gap-2 bg-gradient-to-r from-[#6eb0f2] to-[#6ed2c5] hover:from-[#5ca6ee] hover:to-[#5cc3b5] border-none text-white w-full xl:w-auto px-8 h-12 shadow-md transition-all font-medium text-base"
                                            disabled={!videoCompleted && !isTeacher}
                                            onClick={() => navigate(`/lessons/${nextLesson._id}`)}
                                        >
                                            Keyingi dars
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button disabled className="rounded-[1.25rem] w-full xl:w-auto px-8 h-12 text-base font-medium">Kurs yakunlandi</Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Floating AI Repetitor Button */}
                <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50">
                    <Button 
                        onClick={() => setIsAiTutorOpen(true)}
                        className="rounded-full h-14 w-auto px-6 gap-3 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 text-white group"
                    >
                        <Brain className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-bold tracking-wide">AI Repetitor</span>
                    </Button>
                </div>

                {/* AI Tutor Slide-over Modal */}
                <AnimatePresence>
                    {isAiTutorOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsAiTutorOpen(false)}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                            />
                            
                            {/* Modal Panel */}
                            <motion.div 
                                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-[calc(100vw-3rem)] md:w-[400px] h-[550px] bg-card rounded-[2rem] shadow-2xl z-50 flex flex-col border border-border overflow-hidden"
                            >
                                {/* Header */}
                                <div className="p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                                            <Brain className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm">AI Repetitor</h3>
                                            <div className="flex items-center gap-1.5 opacity-80">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                <p className="text-[10px] uppercase tracking-wider font-medium">Onlayn yordamchi</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsAiTutorOpen(false)}
                                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Chat Body */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-card/50">
                                    {messages.length === 0 && (
                                        <div className="text-center py-8 px-4 flex flex-col items-center justify-center h-full">
                                            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/50">
                                                <Sparkles className="w-8 h-8 text-indigo-500" />
                                            </div>
                                            <h4 className="font-bold text-foreground mb-2">Qanday yordam bera olaman?</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed max-w-[250px]">
                                                Dars bo'yicha tushunmagan joylaringizni yoki qo'shimcha ma'lumotlarni so'rashingiz mumkin.
                                            </p>
                                        </div>
                                    )}
                                    
                                    {messages.map((m, i) => (
                                        <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                                                m.role === 'model' 
                                                    ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm' 
                                                    : 'bg-secondary text-foreground border border-border'
                                            }`}>
                                                {m.role === 'model' ? <Brain className="w-4 h-4" /> : 'Siz'}
                                            </div>
                                            <div className={`p-3.5 rounded-2xl text-sm leading-relaxed max-w-[80%] shadow-sm ${
                                                m.role === 'user' 
                                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                                    : 'bg-secondary/50 text-foreground rounded-tl-none border border-border'
                                            }`}>
                                                {m.text}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {isChatLoading && (
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                                                <Brain className="w-4 h-4" />
                                            </div>
                                            <div className="bg-secondary/50 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center border border-border">
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Chat Input */}
                                <div className="p-4 border-t border-border bg-card shrink-0">
                                    <div className="relative">
                                        <input 
                                            className="w-full bg-secondary/50 rounded-2xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow border border-border/50"
                                            placeholder="Xabar yozing..."
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                                        />
                                        <button 
                                            className="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-sm"
                                            onClick={handleSendChatMessage}
                                            disabled={isChatLoading || !chatInput.trim()}
                                        >
                                            <Send className="w-4 h-4 ml-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

            </div>
        </NavbarWithDrawer>
    );
};

export default LessonViewer;
