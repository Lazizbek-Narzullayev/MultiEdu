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

const getFileUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    const baseServerUrl = API_BASE_URL.replace('/api', '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseServerUrl}${cleanPath}`;
};

const getFileExtension = (url) => {
    if (!url) return 'FAYL';
    try {
        const cleanUrl = url.split(/[?#]/)[0];
        const filename = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1);
        const parts = filename.split('.');
        if (parts.length > 1) {
            const ext = parts.pop().toUpperCase();
            if (ext.length <= 5 && /^[A-Z0-9]+$/.test(ext)) {
                return ext;
            }
        }
    } catch (e) {}
    return 'FAYL';
};

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
    const [isChatExpanded, setIsChatExpanded] = useState(false);

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

    const [isVideoStarted, setIsVideoStarted] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const toggleMute = () => {
        if (playerRef.current) {
            try {
                if (isMuted) {
                    playerRef.current.unMute();
                    setIsMuted(false);
                } else {
                    playerRef.current.mute();
                    setIsMuted(true);
                }
            } catch (e) {
                console.error("Mute toggle error:", e);
            }
        }
    };

    const onPlayerReady = (event) => {
        setDuration(event.target.getDuration());
        playerRef.current = event.target;
        setIsPlayerReady(true);
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
        if (event.data === 1) { // PLAYING
            setIsPlaying(true);
            setIsVideoStarted(true);
        }
        else if (event.data === 2) { // PAUSED
            setIsPlaying(false);
        }
        else if (event.data === 0) { // ENDED
            setIsPlaying(false);
            setVideoCompleted(true);
            if (!lesson.quiz || lesson.quiz.length === 0) {
                markAsViewed();
            }
        }
        else {
            setIsPlaying(false);
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

    const getThumbnail = () => {
        if (lesson.thumbnailUrl && lesson.thumbnailUrl !== 'no-image') return lesson.thumbnailUrl;
        if (videoId) return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800';
    };
    
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

    const handleStartVideo = () => {
        setIsVideoStarted(true);
        if (playerRef.current) {
            try {
                playerRef.current.unMute();
                playerRef.current.setVolume(100);
                setIsMuted(false);
                playerRef.current.seekTo(0);
                playerRef.current.playVideo();
            } catch (e) {
                console.error("Autoplay un-mute error:", e);
            }
        } else {
            setTimeout(() => {
                if (playerRef.current) {
                    try {
                        playerRef.current.unMute();
                        playerRef.current.setVolume(100);
                        setIsMuted(false);
                        playerRef.current.seekTo(0);
                        playerRef.current.playVideo();
                    } catch (e) {}
                }
            }, 500);
        }
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
                            {/* Video Player Container */}
                            <div id="video-container" className="relative bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl border border-border group">
                                {/* Video Player Wrapper with Cinema Masks */}
                                <div className={`w-full h-full relative overflow-hidden transition-all duration-700 ${isVideoStarted ? 'opacity-100' : 'opacity-0'}`}>
                                    <YouTube
                                        videoId={videoId}
                                        opts={{
                                            height: '100%',
                                            width: '100%',
                                            playerVars: { 
                                                rel: 0, 
                                                modestbranding: 1,
                                                controls: 1, 
                                                iv_load_policy: 3,
                                                autoplay: 1,
                                                mute: 1
                                            },
                                        }}
                                        onReady={onPlayerReady}
                                        onStateChange={onPlayerStateChange}
                                        className="w-full h-full absolute top-0 left-0 pointer-events-none select-none z-[1]"
                                    />
                                </div>

                                {/* Custom Poster Overlay (Initial Start) */}
                                <AnimatePresence>
                                    {!isVideoStarted && videoId && (
                                        <motion.div 
                                            initial={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute inset-0 z-30 cursor-pointer group/poster bg-black"
                                            onClick={handleStartVideo}
                                        >
                                            <img 
                                                src={getThumbnail()} 
                                                alt="Poster" 
                                                className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover/poster:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/20" />
                                            
                                            {/* Custom Play Button */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl group-hover/poster:scale-110 transition-all duration-300 ring-8 ring-primary/20">
                                                    {!isPlayerReady ? (
                                                        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <Play className="w-12 h-12 fill-current ml-1" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Badge Overlay */}
                                            <div className="absolute top-8 left-8 flex items-center gap-2">
                                                <div className="px-4 py-2 bg-primary/90 backdrop-blur-md rounded-xl text-[10px] font-black text-white tracking-widest uppercase shadow-lg">
                                                    DARS #{lesson.module || "1"}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Transparent Click Overlay (Play/Pause Toggle) */}
                                {isVideoStarted && (
                                    <div className="absolute inset-0 z-[5] bg-transparent" onClick={() => {
                                        if (isPlaying) playerRef.current?.pauseVideo();
                                        else playerRef.current?.playVideo();
                                    }} />
                                )}

                                {/* Custom Progress Bar Overlay */}
                                <div className={`absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent transition-all duration-500 ${isVideoStarted ? 'opacity-0 group-hover:opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => isPlaying ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo()} className="text-white hover:scale-110 transition-transform">
                                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                                        </button>
                                        <button onClick={toggleMute} className="text-white hover:scale-110 transition-transform" title={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}>
                                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
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
                                            className={`transition-all hover:scale-110 ${showAiSubtitles ? 'text-primary' : 'text-white/60 hover:text-white'}`}
                                            title="AI Subtitrlar (Transkript)"
                                        >
                                            <Languages className="w-5 h-5" />
                                        </button>

                                        <button 
                                            onClick={() => {
                                                const container = document.getElementById('video-container');
                                                if (document.fullscreenElement) {
                                                    document.exitFullscreen();
                                                } else {
                                                    container?.requestFullscreen();
                                                }
                                            }} 
                                            className="text-white/60 hover:text-white transition-all hover:scale-110"
                                            title="To'liq ekran"
                                        >
                                            <Maximize className="w-5 h-5" />
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
                                            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[8] w-[85%] text-center"
                                        >
                                            <span className="bg-black/70 backdrop-blur-xl text-white px-8 py-3 rounded-2xl text-sm md:text-lg font-semibold border border-white/10 shadow-2xl inline-block leading-relaxed">
                                                {getActiveSubtitle()}
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Lock Indicator */}
                                {!videoCompleted && isVideoStarted && (
                                    <div className="absolute top-4 left-4 z-10 pointer-events-none">
                                        <Badge className="bg-amber-500/90 hover:bg-amber-500 backdrop-blur-sm text-white border-0 shadow-lg gap-1.5 px-3 py-1 text-xs font-bold">
                                            <Lock className="w-3 h-3" />
                                            O'tkazish cheklangan
                                        </Badge>
                                    </div>
                                )}
                            </div>


                            {/* Lesson Metadata */}
                            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-primary/10" />
                                
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 relative z-10">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                                                {lesson.title}
                                            </h1>
                                            {isTeacher && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="w-10 h-10 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 border border-slate-100"
                                                    onClick={() => navigate(`/lessons/edit/${id}`)}
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-slate-50 border-slate-200 text-slate-600 font-bold text-xs">
                                                {lesson.course?.title || "Kurs"}
                                            </Badge>
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                            <span className="text-sm font-black text-primary uppercase tracking-widest">
                                                {lesson.module || "1"}-Modul, Dars
                                            </span>
                                        </div>
                                    </div>
                                    <Badge className="w-fit text-xs px-6 py-2.5 font-black bg-[#7c3aed] text-white rounded-full shadow-lg shadow-indigo-500/20 uppercase tracking-widest">
                                        Hozir koʻrilmoqda
                                    </Badge>
                                </div>

                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-black text-xl text-slate-900">Maʼruza Matni</h3>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className={`rounded-2xl h-12 px-6 font-black text-xs transition-all duration-300 ${isSpeaking && !isPaused ? 'text-white bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/30' : 'text-indigo-600 border-indigo-100 bg-indigo-50 hover:bg-indigo-100'}`}
                                            onClick={toggleSpeech}
                                        >
                                            {isSpeaking && !isPaused ? (
                                                <><Pause className="w-4 h-4 mr-2" /> Toʻxtatib turish</>
                                            ) : isPaused ? (
                                                <><Play className="w-4 h-4 mr-2" /> Davom etish</>
                                            ) : (
                                                <><Volume2 className="w-4 h-4 mr-2" /> Eshitish</>
                                            )}
                                        </Button>
                                    </div>
                                    <div className="prose prose-slate max-w-none text-slate-600 max-h-[400px] overflow-y-auto custom-scrollbar pr-6">
                                        <p className="whitespace-pre-wrap leading-relaxed text-lg font-medium">
                                            {lesson.textContent || lesson.description || "Ushbu dars uchun matn kiritilmagan."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Interactive Content */}
                        <div className="lg:col-span-4 lg:h-[calc(100vh-120px)] lg:sticky lg:top-24 flex flex-col gap-6">
                            <div className="bg-white border border-slate-200 rounded-[3rem] flex-1 flex flex-col shadow-sm overflow-hidden relative">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md z-10">
                                        <TabsList className="grid grid-cols-3 gap-3 w-full h-[60px] bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                            <TabsTrigger value="3d" className="rounded-xl text-xs font-black uppercase tracking-widest h-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md border border-transparent data-[state=active]:border-slate-100 transition-all" disabled={!lesson.model3dUrl && !lesson.interactiveUrl}>
                                                <Cuboid className="w-4 h-4 mr-2" />
                                                <span>3D</span>
                                            </TabsTrigger>
                                            <TabsTrigger value="fayllar" className="rounded-xl text-xs font-black uppercase tracking-widest h-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md border border-transparent data-[state=active]:border-slate-100 transition-all">
                                                <FileText className="w-4 h-4 mr-2" />
                                                <span>Fayllar</span>
                                            </TabsTrigger>
                                            <TabsTrigger value="chat" className="rounded-xl text-xs font-black uppercase tracking-widest h-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md border border-transparent data-[state=active]:border-slate-100 transition-all">
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                <span>Chat</span>
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <div className="flex-1 p-0 overflow-hidden">
                                        <TabsContent value="3d" className="m-0 h-full flex flex-col p-6">
                                            {(lesson.model3dUrl || lesson.interactiveUrl) ? (
                                                <div className="flex-1 w-full bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner relative group">
                                                    <ModelViewer model={{ url: getFileUrl(lesson.model3dUrl || lesson.interactiveUrl) }} />
                                                    <div className="absolute top-4 left-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-bold text-[10px] px-3 py-1 rounded-lg">
                                                            3D ENGINE v2.0
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-slate-300 py-12 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                                                    <Cuboid className="w-16 h-16 mb-4 opacity-10" />
                                                    <p className="font-black text-xs uppercase tracking-widest">Model mavjud emas</p>
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="fayllar" className="m-0 space-y-4 p-6 overflow-y-auto custom-scrollbar">
                                            <div className="space-y-3">
                                                {/* Multi-document support (new) */}
                                                {lesson.documents && lesson.documents.length > 0 && lesson.documents.map((doc, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer">
                                                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-black text-xs text-slate-900 truncate">{doc.name || 'Hujjat'}</p>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                                                {getFileExtension(doc.url)}
                                                            </p>
                                                        </div>
                                                        <Button size="sm" variant="ghost" className="h-8 rounded-lg font-black text-[9px] uppercase tracking-widest hover:text-rose-500" onClick={() => window.open(getFileUrl(doc.url))}>
                                                            Yuklash
                                                        </Button>
                                                    </div>
                                                ))}

                                                {/* Backward compat: show old documentUrl if documents array is empty */}
                                                {(!lesson.documents || lesson.documents.length === 0) && lesson.documentUrl && (
                                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer">
                                                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-black text-xs text-slate-900 truncate">Dars taqdimoti</p>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">PDF</p>
                                                        </div>
                                                        <Button size="sm" variant="ghost" className="h-8 rounded-lg font-black text-[9px] uppercase tracking-widest hover:text-rose-500" onClick={() => window.open(getFileUrl(lesson.documentUrl))}>
                                                            Yuklash
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* Audio */}
                                                {lesson.audioUrl && (
                                                    <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                                                <Volume2 className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-black text-xs text-slate-900 truncate">Audio podkast</p>
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">MP3</p>
                                                            </div>
                                                        </div>
                                                        <audio src={getFileUrl(lesson.audioUrl)} controls className="h-8 w-full scale-[0.9] origin-left" />
                                                    </div>
                                                )}

                                                {/* Empty state */}
                                                {(!lesson.documents || lesson.documents.length === 0) && !lesson.documentUrl && !lesson.audioUrl && (
                                                    <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                                                        <FileText className="w-12 h-12 mb-3 opacity-10" />
                                                        <p className="font-black text-[10px] uppercase tracking-widest text-center">Fayllar yoʻq</p>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="chat" className="m-0 h-full flex flex-col p-6 overflow-hidden">
                                            <div className="flex items-center justify-between mb-4 shrink-0">
                                                <div>
                                                    <h3 className="font-black text-sm text-slate-900 uppercase tracking-widest">Muhokama</h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[9px] px-2 py-0.5 rounded-full">{discussionMessages.length}</Badge>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5"
                                                        onClick={() => setIsChatExpanded(true)}
                                                    >
                                                        <Maximize className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar mb-4">
                                                {discussionMessages.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center h-full text-slate-300 text-center px-4">
                                                        <MessageCircle className="w-12 h-12 mb-3 opacity-10" />
                                                        <p className="font-black text-[10px] uppercase tracking-widest">Xabarlar yoʻq</p>
                                                    </div>
                                                ) : (
                                                    discussionMessages.map((msg) => (
                                                        <div key={msg._id} className={`flex gap-2 ${msg.sender?._id === user?._id ? 'flex-row-reverse' : ''}`}>
                                                            <div className={`space-y-1 max-w-[90%] ${msg.sender?._id === user?._id ? 'items-end text-right' : ''}`}>
                                                                <div className={`p-2.5 rounded-xl text-[11px] font-medium shadow-sm ${
                                                                    msg.sender?._id === user?._id 
                                                                        ? 'bg-[#7c3aed] text-white rounded-tr-none' 
                                                                        : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none'
                                                                }`}>
                                                                    {msg.text}
                                                                </div>
                                                                <div className="flex items-center gap-2 px-1 text-[8px] font-black uppercase text-slate-400">
                                                                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                    <span className={msg.sender?.role === 'teacher' || msg.sender?.role === 'admin' ? 'text-indigo-600' : ''}>
                                                                        {msg.sender?.role === 'teacher' || msg.sender?.role === 'admin' ? "Oʻqituvchi" : msg.sender?.name?.[0]}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                                <div ref={discussionEndRef} />
                                            </div>
                                            
                                            <div className="pt-4 border-t border-slate-100 mt-auto bg-white relative shrink-0">
                                                <div className="relative group">
                                                    <input 
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-12 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                                                        placeholder="Xabar..."
                                                        value={discussionInput}
                                                        onChange={(e) => setDiscussionInput(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSendDiscussion()}
                                                    />
                                                    <Button 
                                                        size="icon" 
                                                        className="absolute right-1 top-1 w-8 h-8 rounded-lg bg-[#7c3aed] text-white" 
                                                        onClick={handleSendDiscussion}
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </div>
                                    
                                    {/* Cohesive Navigation Button Area */}
                                    <div className="p-8 border-t border-slate-100 bg-slate-50/50 shrink-0">
                                        {hasQuiz && !hasPassedQuiz ? (
                                            <Button 
                                                className="w-full rounded-2xl h-16 bg-[#7c3aed] hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-widest gap-3 shadow-xl shadow-indigo-500/20 transition-all duration-300 group"
                                                onClick={() => navigate(`/lessons/${id}/quiz`)}
                                                disabled={!videoCompleted && !isTeacher}
                                            >
                                                <BookOpen className="w-5 h-5" />
                                                Testni boshlash
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        ) : nextLesson ? (
                                            <Button 
                                                className="w-full rounded-2xl h-16 bg-slate-900 hover:bg-black text-white font-black text-sm uppercase tracking-widest gap-3 shadow-xl transition-all duration-300 group"
                                                disabled={!videoCompleted && !isTeacher}
                                                onClick={() => navigate(`/lessons/${nextLesson._id}`)}
                                            >
                                                Keyingi dars
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        ) : (
                                            <Button disabled className="w-full rounded-2xl h-16 bg-slate-100 text-slate-400 font-black text-sm uppercase tracking-widest border-none">
                                                Kurs yakunlandi
                                            </Button>
                                        )}
                                    </div>
                                </Tabs>
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

                {/* Discussion Modal */}
                <AnimatePresence>
                    {isChatExpanded && (
                        <>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsChatExpanded(false)}
                                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
                            />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="fixed inset-x-4 top-[10%] bottom-[10%] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-[2.5rem] shadow-2xl z-[101] flex flex-col overflow-hidden border border-slate-100"
                            >
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                            <MessageCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900">Muhokama</h2>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dars yuzasidan fikrlar</p>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="w-10 h-10 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors"
                                        onClick={() => setIsChatExpanded(false)}
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30">
                                    {discussionMessages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-300">
                                            <MessageCircle className="w-16 h-16 mb-4 opacity-10" />
                                            <p className="text-sm font-black uppercase tracking-widest">Xabarlar yoʻq</p>
                                        </div>
                                    ) : (
                                        discussionMessages.map((msg) => (
                                            <div key={msg._id} className={`flex gap-4 ${msg.sender?._id === user?._id ? 'flex-row-reverse' : ''}`}>
                                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 font-black text-sm shrink-0 shadow-sm overflow-hidden">
                                                    {msg.sender?.avatarUrl ? <img src={msg.sender.avatarUrl} alt="" className="w-full h-full object-cover" /> : msg.sender?.name?.[0]}
                                                </div>
                                                <div className={`space-y-2 max-w-[80%] ${msg.sender?._id === user?._id ? 'items-end' : ''}`}>
                                                    <div className="flex items-center gap-2 px-1">
                                                        <span className="text-[10px] font-black text-slate-900">{msg.sender?.name}</span>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm transition-all ${
                                                        msg.sender?._id === user?._id 
                                                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                                                            : 'bg-white text-slate-700 rounded-tl-none'
                                                    }`}>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={discussionEndRef} />
                                </div>

                                <div className="p-6 bg-white border-t border-slate-100">
                                    <div className="relative group">
                                        <input 
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-6 pr-14 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-200 transition-all shadow-inner"
                                            placeholder="Fikringizni yozing..."
                                            value={discussionInput}
                                            onChange={(e) => setDiscussionInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendDiscussion()}
                                        />
                                        <Button 
                                            size="icon" 
                                            className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all" 
                                            onClick={handleSendDiscussion}
                                        >
                                            <Send className="w-5 h-5" />
                                        </Button>
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
