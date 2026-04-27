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
    Skeleton
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TMACourses = () => {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.token) return;
            try {
                const res = await axios.get(`${API_BASE_URL}/courses/my-courses`, {
                    headers: { 'x-auth-token': user.token }
                });
                setCourses(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.token]);

    const handleHaptic = () => {
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    };

    if (loading) {
        return (
            <Box>
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} variant="rectangular" height={150} sx={{ borderRadius: 6, mb: 2 }} />
                ))}
            </Box>
        );
    }

    if (!user) return null;

    return (
        <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Courses Stack (Vertical) */}
            {courses.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 6, border: '1px dashed #ccc' }}>
                    <Typography color="text.secondary">Hozircha kurslar yo'q</Typography>
                    <Button variant="outlined" sx={{ mt: 2, borderRadius: 4 }} onClick={() => navigate('/tma/home')}>
                        Asosiyga qaytish
                    </Button>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {courses.map((course) => (
                        <Card 
                            key={course._id}
                            onClick={() => { handleHaptic(); navigate(`/tma/courses/${course._id}`); }}
                            sx={{ 
                                borderRadius: 6, 
                                display: 'flex', 
                                overflow: 'hidden',
                                transition: '0.3s',
                                border: '1px solid rgba(0,0,0,0.04)',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
                                '&:hover': { transform: 'scale(1.02)' },
                                cursor: 'pointer'
                            }}
                        >
                            <CardMedia
                                component="img"
                                sx={{ width: 100, objectFit: 'cover' }}
                                image={course.thumbnail ? `${API_BASE_URL}/uploads/${course.thumbnail}` : "/default-course.png"}
                                alt={course.title}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                        <Chip label="Faol" size="small" color="success" sx={{ fontSize: '0.6rem', height: 18 }} />
                                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                            {course.lessons?.length || 0} Dars
                                        </Typography>
                                    </Stack>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 1 }}>
                                        {course.title}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={20} // Mock progress
                                            sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.05)' }} 
                                        />
                                    </Box>
                                </CardContent>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
                                <IconButton color="primary">
                                    <PlayCircleOutlineIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default TMACourses;
