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
        <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}} />

            {/* User Greeting */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
                        Salom, {user?.name.split(' ')[0]} 👋
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Bugun nimani o'rganamiz?
                    </Typography>
                </Box>
                <Avatar 
                    src={user?.avatar || "/default-avatar.png"} 
                    sx={{ width: 56, height: 56, border: '3px solid', borderColor: 'primary.main', boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)' }}
                />
            </Box>

            {/* Creative Continue Learning Card */}
            <Card sx={{ 
                mb: 4, 
                borderRadius: 6, 
                overflow: 'hidden', 
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                boxShadow: '0 20px 40px rgba(25, 118, 210, 0.3)',
                position: 'relative'
            }}>
                <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, transform: 'rotate(15deg)' }}>
                    <TrendingUpIcon sx={{ fontSize: 160 }} />
                </Box>
                <CardContent sx={{ p: 4, position: 'relative' }}>
                    <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 900, opacity: 0.8 }}>
                        DAVOM ETTIRAMIZ
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                        {courses[0]?.title || "Hozircha kurslar yo'q"}
                    </Typography>
                    <Box sx={{ mt: 3, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Jarayon: 45%</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Progress</Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={45} 
                            sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} 
                        />
                    </Box>
                    <Button 
                        variant="contained" 
                        fullWidth 
                        startIcon={<PlayArrowIcon />} 
                        onClick={() => { handleHaptic(); navigate(`/tma/courses/${courses[0]?._id}`); }}
                        sx={{ 
                            mt: 2, 
                            borderRadius: 4, 
                            bgcolor: 'white', 
                            color: 'primary.main', 
                            fontWeight: 'bold',
                            textTransform: 'none',
                            py: 1.5,
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            '&:hover': { bgcolor: '#f5f5f5' }
                        }}
                    >
                        Darsni ko'rish
                    </Button>
                </CardContent>
            </Card>

            {/* Quick Stats Box (Flex) */}
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, ml: 1 }}>Statistika</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Paper sx={{ p: 3, borderRadius: 6, textAlign: 'center', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', flex: 1 }}>
                    <Box sx={{ p: 1.5, bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#2e7d32', borderRadius: '50%', display: 'inline-flex', mb: 1.5 }}>
                        <TrendingUpIcon />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>12</Typography>
                    <Typography variant="caption" color="text.secondary">O'qilgan darslar</Typography>
                </Paper>
                <Paper sx={{ p: 3, borderRadius: 6, textAlign: 'center', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', flex: 1 }}>
                    <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#ef6c00', borderRadius: '50%', display: 'inline-flex', mb: 1.5 }}>
                        <StarsIcon />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>450</Typography>
                    <Typography variant="caption" color="text.secondary">Ballar</Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default TMAHome;
