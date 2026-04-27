const fs = require('fs');
const file = 'src/Components/Multimodal/LessonViewer.jsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const newCode = `    return (match && match[2].length === 11) ? match[2] : null;
}

const LessonViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const user = useSelector((state) => state.auth.user);
    const isTeacher = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'superadmin';

    // State Variables
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [videoCompleted, setVideoCompleted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showAiSubtitles, setShowAiSubtitles] = useState(false);
    
    // AI & Chat
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatMaximized, setIsChatMaximized] = useState(false);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);

    // Discussion
    const [discussionMessages, setDiscussionMessages] = useState([]);
    const [discussionInput, setDiscussionInput] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const discussionContainerRef = useRef(null);
    const discussionEndRef = useRef(null);

    // Audio & TTS
    const [tabValue, setTabValue] = useState('text');
    const [ttsSpeed, setTtsSpeed] = useState(1);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    
    // Quiz
    const [quizOpen, setQuizOpen] = useState(false);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [quizResults, setQuizResults] = useState({});
    const [quizPassed, setQuizPassed] = useState(false);

    const [nextLesson, setNextLesson] = useState(null);

    const playerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    useEffect(() => {
        fetchLesson();
        fetchDiscussion();
    }, [id]);

    const fetchLesson = async () => {
        try {
            setLoading(true);
            const res = await axios.get(\`\${API_BASE_URL}/lessons/\${id}\`);
            setLesson(res.data);
            
            // Check if video was already completed
            if (res.data.viewedBy && res.data.viewedBy.includes(user?._id)) {
                setVideoCompleted(true);
            }
            
            if (res.data.course) {
                const courseId = typeof res.data.course === 'object' ? res.data.course._id : res.data.course;
                const courseRes = await axios.get(\`\${API_BASE_URL}/courses/\${courseId}\`);
                const lessons = courseRes.data.lessons || [];
                const currentIndex = lessons.findIndex(l => (l._id || l) === id);
                if (currentIndex >= 0 && currentIndex < lessons.length - 1) {
                    setNextLesson(lessons[currentIndex + 1]);
                } else {
                    setNextLesson(null);
                }
            }
        } catch (err) {
            console.error('Error fetching lesson:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDiscussion = async () => {
        try {
            const res = await axios.get(\`\${API_BASE_URL}/discussions/lesson/\${id}\`);
            setDiscussionMessages(res.data);
            scrollToBottom();
        } catch (err) {
            console.error('Error fetching discussion:', err);
        }
    };

    const markAsViewed = async () => {
        try {
            if(user && user.token) {
                await axios.post(\`\${API_BASE_URL}/lessons/\${id}/view\`, {}, {
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
        setInterval(() => {
            if(event.target.getPlayerState() === 1) {
                setCurrentTime(event.target.getCurrentTime());
            }
        }, 1000);
    };

    const onPlayerStateChange = (event) => {
        if (event.data === 1) setIsPlaying(true);
        else setIsPlaying(false);
        
        if (event.data === 0) { // ENDED
            setVideoCompleted(true);
            if (isTeacher) setQuizPassed(true);
            if (!lesson.quiz || lesson.quiz.length === 0) {
                markAsViewed();
            }
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimeoutRef.current);
        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2500);
        }
    };

    const handlePlayPause = () => {
        if (!playerRef.current) return;
        if (isPlaying) {
            if(playerRef.current.pauseVideo) playerRef.current.pauseVideo();
            else playerRef.current.pause();
            setIsPlaying(false);
        } else {
            if(playerRef.current.playVideo) playerRef.current.playVideo();
            else playerRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleSeek = (e, newValue) => {
        setCurrentTime(newValue);
        if(playerRef.current) {
            if(playerRef.current.seekTo) playerRef.current.seekTo(newValue, true);
            else playerRef.current.currentTime = newValue;
        }
    };

    const toggleFullscreen = () => {
        const elem = document.getElementById('video-wrapper');
        if (!elem) return;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {});
        } else {
            document.exitFullscreen();
        }
    };

    const formatVideoTime = (time) => {
        if(!time) return '0:00';
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return \`\${m}:\${s < 10 ? '0' : ''}\${s}\`;
    };

    const handleTabChange = (event, newValue) => setTabValue(newValue);

    const handleGenerateSummary = async () => {
        if(isSummaryLoading) return;
        setIsSummaryLoading(true);
        try {
            const prompt = \`Iltimos, ushbu dars materialidan qisqacha xulosa yasab bering: \${lesson.title}. \n\n\${lesson.textContent || lesson.description || ''}\`;
            const res = await axios.post(\`\${API_BASE_URL}/ai/tutor\`, { message: prompt });
            setMessages(prev => [...prev, { role: 'model', text: '**Dars xulosasi:**\n' + res.data.response }]);
            setIsChatMaximized(true);
        } catch (err) {
        } finally {
            setIsSummaryLoading(false);
        }
    };

    const handleSendChatMessage = async () => {
        if(!chatInput.trim()) return;
        const newMsg = { role: 'user', text: chatInput };
        setMessages([...messages, newMsg]);
        setChatInput('');
        setIsChatLoading(true);
        try {
            const res = await axios.post(\`\${API_BASE_URL}/ai/tutor\`, { 
                message: chatInput,
                context: \`Dars mavzusi: \${lesson?.title}. \${lesson?.textContent || lesson?.description || ''}\`
            });
            setMessages(prev => [...prev, { role: 'model', text: res.data.response }]);
        } catch(err) {
            setMessages(prev => [...prev, { role: 'model', text: 'Kechirasiz, xatolik yuz berdi. Keyinroq urinib ko\\'ring.' }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleTtsPlay = () => {
        if (!lesson?.textContent && !lesson?.description) return;
        const utterance = new SpeechSynthesisUtterance(lesson.textContent || lesson.description);
        utterance.rate = ttsSpeed;
        utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        setIsPaused(false);
    };
    
    const handleTtsPause = () => {
        window.speechSynthesis.pause();
        setIsPaused(true);
    };

    const handleTtsStop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, []);

    const handleSendDiscussion = async () => {
        if (!discussionInput.trim() || !user) return;
        try {
            const payload = { 
                lessonId: id, 
                text: discussionInput, 
                parentMessageId: replyTo?._id 
            };
            const res = await axios.post(\`\${API_BASE_URL}/discussions\`, payload, {
                headers: { 'x-auth-token': user.token }
            });
            setDiscussionMessages([...discussionMessages, res.data]);
            setDiscussionInput('');
            setReplyTo(null);
            scrollToBottom();
        } catch (err) {}
    };

    const handleDeleteMessage = async (msgId) => {
        try {
            await axios.delete(\`\${API_BASE_URL}/discussions/\${msgId}\`, {
                headers: { 'x-auth-token': user.token }
            });
            setDiscussionMessages(discussionMessages.filter(m => m._id !== msgId));
        } catch (err) {}
    };

    const handleReplyClick = (msg) => {
        setReplyTo(msg);
        discussionInputRef.current?.focus();
    };

    const getParentInfo = (parentId) => {
        if(!parentId) return null;
        return discussionMessages.find(m => m._id === parentId);
    };

    const getRoleLabel = (role) => {
        if (role === 'admin' || role === 'superadmin') return 'Admin';
        if (role === 'teacher') return 'O\\'qituvchi';
        return 'O\\'quvchi';
    };

    const formatMessageDate = (dateString) => {
        if(!dateString) return '';
        const d = new Date(dateString);
        return \`\${d.getHours().toString().padStart(2,'0')}:\${d.getMinutes().toString().padStart(2,'0')} \${d.getDate()}.\${d.getMonth()+1}.\${d.getFullYear()}\`;
    };

    const handleScroll = () => {};

    if (loading) {
        return (
            <NavbarWithDrawer>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress size={60} sx={{ color: 'var(--primary)' }} />
                </Box>
            </NavbarWithDrawer>
        );
    }

    if (!lesson) {
        return (
            <NavbarWithDrawer>
                <Container sx={{ mt: 5, textAlign: 'center' }}>
                    <Typography variant="h5">Dars topilmadi</Typography>
                    <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate(-1)}>Orqaga</Button>
                </Container>
            </NavbarWithDrawer>
        );
    }

    const videoId = getYouTubeId(lesson.videoUrl);
    const isLocalVideo = lesson.videoUrl && !videoId;
    const has3DModel = !!(lesson.model3dUrl || lesson.interactiveUrl);

    return (`;

lines[50] = newCode;
fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Success');
