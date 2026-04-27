import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    LinearProgress, 
    Button, 
    Avatar, 
    Stack, 
    Paper,
    CardMedia,
    Chip,
    Skeleton,
    Divider,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const TMALesson = () => {
    const { user } = useSelector(state => state.auth);
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!user?.token) return;
            try {
                const res = await axios.get(`${API_BASE_URL}/courses/${courseId}`, {
                    headers: { 'x-auth-token': user.token }
                });
                setCourse(res.data);
                
                // If lessonId is provided, find it. Otherwise, default to first lesson or lessonId.
                if (lessonId) {
                    const found = res.data.lessons.find(l => l._id === lessonId);
                    setLesson(found);
                } else if (res.data.lessons.length > 0) {
                    setLesson(res.data.lessons[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId, lessonId, user?.token]);

    const handleHaptic = () => {
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    };

    if (!user) return null;

    if (loading) {
        return (
            <Box>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 6, mb: 4 }} />
                <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="100%" height={200} />
            </Box>
        );
    }

    if (!course || !lesson) {
        return <Typography>Dars topilmadi</Typography>;
    }

    return (
        <Box sx={{ animation: 'fadeIn 0.5s ease-out', pb: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => { handleHaptic(); navigate(-1); }} size="small">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {course.title}
                </Typography>
            </Box>

            {/* Video Placeholder or Content Card */}
            <Card sx={{ borderRadius: 6, overflow: 'hidden', mb: 4, position: 'relative', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}>
                {lesson.videoUrl ? (
                    <Box sx={{ position: 'relative', pt: '56.25%' }}>
                         <iframe 
                            src={lesson.videoUrl.replace('watch?v=', 'embed/')} 
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        />
                    </Box>
                ) : (
                    <Box sx={{ p: 4, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
                         <Typography variant="h4">🎬</Typography>
                         <Typography variant="caption">Video dars mavjud emas</Typography>
                    </Box>
                )}
            </Card>

            {/* Lesson Title & Progress */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>{lesson.title}</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip label="Dars" size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
                    <Chip label="Sertifikatlangan" size="small" sx={{ fontWeight: 'bold', bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#2e7d32' }} />
                </Stack>
            </Box>

            {/* Lesson Content Tab Area (Minimalist) */}
            <Paper sx={{ p: 4, borderRadius: 6, mb: 4, border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>Mavzu mazmuni</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
                    {lesson.content || "Mazmun tafsilotlari mavjud emas."}
                </Typography>
            </Paper>

            {/* Action Buttons */}
            <Stack spacing={2}>
                <Button 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleHaptic()}
                    sx={{ borderRadius: 4, py: 2, fontWeight: 'bold', textTransform: 'none' }}
                >
                    Tugatish deb belgilash
                </Button>
                <Button 
                    variant="outlined" 
                    fullWidth 
                    size="large"
                    startIcon={<ChatIcon />}
                    onClick={() => { handleHaptic(); navigate(`/tma/chat/${lesson._id}`); }}
                    sx={{ borderRadius: 4, py: 2, fontWeight: 'bold', textTransform: 'none' }}
                >
                    O'qituvchiga savol berish
                </Button>
            </Stack>
        </Box>
    );
};

export default TMALesson;
