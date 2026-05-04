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
    IconButton
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarsIcon from '@mui/icons-material/Stars';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TMAHome = () => {
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
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
    };

    if (!user) return null;

    return (
        <Box sx={{ animation: 'fadeIn 0.5s ease-out', pb: 10 }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            `}} />

            {/* User Greeting - Bolder & Larger */}
            <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 950, color: '#0f172a', letterSpacing: '-0.02em', mb: 1 }}>
                        Salom, {user?.name.split(' ')[0]} 👋
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Bugun yangi marralarni zabt etamiz!
                    </Typography>
                </Box>
                <Avatar 
                    src={user?.avatar || "/default-avatar.png"} 
                    sx={{ width: 64, height: 64, border: '4px solid white', boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)', bgcolor: '#7c3aed' }}
                >
                    {user?.name?.charAt(0)}
                </Avatar>
            </Box>

            {/* Creative Continue Learning Card - Purple Gradient & High Impact */}
            <Card sx={{ 
                mb: 6, 
                borderRadius: 8, 
                overflow: 'hidden', 
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                color: 'white',
                boxShadow: '0 25px 50px rgba(124, 58, 237, 0.4)',
                position: 'relative',
                border: 'none'
            }}>
                <Box sx={{ position: 'absolute', top: -30, right: -30, opacity: 0.15, transform: 'rotate(15deg)' }}>
                    <PlayArrowIcon sx={{ fontSize: 200 }} />
                </Box>
                <CardContent sx={{ p: 5, position: 'relative' }}>
                    <Typography variant="overline" sx={{ letterSpacing: 4, fontWeight: 900, opacity: 0.9, fontSize: '0.75rem' }}>
                        DAVOM ETTIRAMIZ
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 950, mb: 2, mt: 1, lineHeight: 1.2 }}>
                        {courses[0]?.title || "Hozircha kurslar yo'q"}
                    </Typography>
                    
                    <Box sx={{ mt: 4, mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '0.75rem' }}>JARAYON: 45%</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 900, opacity: 0.8 }}>PREMIUM</Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={45} 
                            sx={{ 
                                height: 12, 
                                borderRadius: 6, 
                                bgcolor: 'rgba(255,255,255,0.15)', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                '& .MuiLinearProgress-bar': { 
                                    bgcolor: 'white',
                                    borderRadius: 6,
                                    boxShadow: '0 0 15px rgba(255,255,255,0.5)'
                                } 
                            }} 
                        />
                    </Box>
                    
                    <Button 
                        variant="contained" 
                        fullWidth 
                        startIcon={<PlayArrowIcon />} 
                        onClick={() => { handleHaptic(); navigate(`/tma/courses/${courses[0]?._id}`); }}
                        sx={{ 
                            mt: 3, 
                            borderRadius: 5, 
                            bgcolor: 'white', 
                            color: '#7c3aed', 
                            fontWeight: 900,
                            textTransform: 'none',
                            py: 2.5,
                            fontSize: '1.1rem',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            '&:hover': { bgcolor: '#f8fafc' },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Darsni boshlash
                    </Button>
                </CardContent>
            </Card>

            {/* Quick Stats Box (Flex) - More Modern */}
            <Typography variant="h6" sx={{ fontWeight: 950, mb: 3, ml: 1, color: '#0f172a' }}>Platforma statistikasi</Typography>
            <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                <Paper sx={{ p: 4, borderRadius: 8, textAlign: 'center', border: '1px solid #f1f5f9', boxShadow: '0 15px 35px rgba(0,0,0,0.03)', flex: 1 }}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', borderRadius: '24px', display: 'inline-flex', mb: 2 }}>
                        <TrendingUpIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 950, color: '#1e293b' }}>12</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', tracking: 1 }}>Darslar</Typography>
                </Paper>
                <Paper sx={{ p: 4, borderRadius: 8, textAlign: 'center', border: '1px solid #f1f5f9', boxShadow: '0 15px 35px rgba(0,0,0,0.03)', flex: 1 }}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(251, 191, 36, 0.1)', color: '#d97706', borderRadius: '24px', display: 'inline-flex', mb: 2 }}>
                        <StarsIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 950, color: '#1e293b' }}>450</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', tracking: 1 }}>Ballar</Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default TMAHome;
