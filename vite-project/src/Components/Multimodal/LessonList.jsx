import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Chip,
    Skeleton,
    Container,
    IconButton,
    Stack,
    Divider,
    InputBase,
    Paper
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessons, deleteLesson } from '../../store/Slice/lessonSlice';
import { logout } from '../../store/Slice/authSlice';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FilterListIcon from '@mui/icons-material/FilterList';
import NavbarWithDrawer from '../NavDrawer';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

const LessonList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { lessons, loading, error } = useSelector((state) => state.lessons);
    const { user } = useSelector((state) => state.auth);
    const [completedLessonIds, setCompletedLessonIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);

    useEffect(() => {
        dispatch(fetchLessons());
        
        if (user && user.token) {
            axios.get(`${API_BASE_URL}/lessons/my-progress`, {
                headers: { 'x-auth-token': user.token }
            })
            .then(res => setCompletedLessonIds(res.data))
            .catch(err => console.error("Error fetching progress:", err));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (error) {
            const isAuthError = error.includes('401') || error.toLowerCase().includes('token');
            if (isAuthError) {
                Swal.fire({
                    title: 'Sessiya muddati tugadi',
                    text: 'Iltimos, qaytadan tizimga kiring',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                }).then(() => {
                    dispatch(logout());
                    navigate('/login');
                });
            } else {
                Swal.fire('Xato', error, 'error');
            }
        }
    }, [error, navigate, dispatch]);

    const handleMenuOpen = (event, lesson) => {
        setAnchorEl(event.currentTarget);
        setSelectedLesson(lesson);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedLesson(null);
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Ishonchingiz komilmi?',
            text: "Darsni o'chirib bo'lmaydi!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ha, o\'chirish',
            cancelButtonText: 'Bekor qilish'
        });

        if (result.isConfirmed) {
            dispatch(deleteLesson(selectedLesson._id));
            handleMenuClose();
            Swal.fire('O\'chirildi!', 'Dars muvaffaqiyatli o\'chirildi.', 'success');
        }
    };

    const getThumbnail = (lesson) => {
        if (lesson.thumbnailUrl && lesson.thumbnailUrl !== 'no-image') return lesson.thumbnailUrl;
        if (lesson.videoUrl && lesson.videoUrl.includes('youtube.com')) {
            const videoId = lesson.videoUrl.split('v=')[1]?.split('&')[0];
            if (videoId) return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800';
    };

    const filteredLessons = lessons.filter(l => 
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <NavbarWithDrawer>
            <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pt: 0, pb: 20 }}>
                {/* Hero Header Section */}
                <Box sx={{ 
                    position: 'relative', 
                    mb: 8, 
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    pt: 10,
                    pb: 12,
                    color: 'white'
                }}>
                    <Box sx={{ 
                        position: 'absolute', 
                        top: -50, 
                        right: -50, 
                        width: 300, 
                        height: 300, 
                        background: 'radial-gradient(circle, rgba(0, 165, 196, 0.15) 0%, rgba(0,0,0,0) 70%)',
                        borderRadius: '50%'
                    }} />
                    
                    <Container maxWidth="lg">
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={4}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <LibraryBooksIcon sx={{ color: '#00A5C4' }} />
                                    <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 2, color: '#00A5C4' }}>
                                        Platforma resurslari
                                    </Typography>
                                </Stack>
                                <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, letterSpacing: -1, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
                                    Darslar va <span style={{ color: '#00A5C4' }}>resurslar</span>
                                </Typography>
                                <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 600, fontWeight: 500 }}>
                                    Innovatsion texnologiyalarni multimodal usulda o'rganing. Kelajak texnologiyalari markaziga xush kelibsiz.
                                </Typography>
                            </motion.div>

                            {(user?.role === 'admin' || user?.role === 'super-admin' || user?.role === 'teacher') && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={() => navigate('/lessons/add')}
                                        sx={{ 
                                            borderRadius: '20px', 
                                            px: 6, 
                                            py: 2.5, 
                                            fontWeight: 900, 
                                            textTransform: 'none', 
                                            bgcolor: '#00A5C4',
                                            fontSize: '1.05rem',
                                            boxShadow: '0 20px 40px rgba(0, 165, 196, 0.25)',
                                            '&:hover': { bgcolor: '#008ba5', transform: 'translateY(-3px)' },
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                    >
                                        Yangi dars qo'shish
                                    </Button>
                                </motion.div>
                            )}
                        </Stack>
                    </Container>
                </Box>

                <Container maxWidth="lg">
                    {/* Search & Filter Bar */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Paper elevation={0} sx={{ 
                            p: 1.5, 
                            mb: 8, 
                            mt: -14,
                            borderRadius: '24px', 
                            bgcolor: 'white', 
                            display: 'flex', 
                            alignItems: 'center', 
                            boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
                            border: '1px solid #f1f5f9',
                            zIndex: 10,
                            position: 'relative'
                        }}>
                            <Box sx={{ p: 1, ml: 1, display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
                                <SearchIcon />
                            </Box>
                            <InputBase
                                sx={{ ml: 2, flex: 1, fontWeight: 600, fontSize: '1rem' }}
                                placeholder="Darslar yoki turkumlar bo'yicha qidirish..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <IconButton sx={{ p: 1.5, color: '#64748b' }}>
                                <FilterListIcon />
                            </IconButton>
                        </Paper>
                    </motion.div>

                    {loading ? (
                        <Grid container spacing={4}>
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <Grid item xs={12} sm={6} md={4} key={n}>
                                    <Skeleton variant="rectangular" height={280} sx={{ borderRadius: '24px' }} />
                                    <Skeleton height={40} sx={{ mt: 2, borderRadius: 2 }} />
                                    <Skeleton width="60%" height={24} sx={{ borderRadius: 1 }} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Grid container spacing={4}>
                            <AnimatePresence>
                                {filteredLessons.map((lesson, index) => {
                                    const isCompleted = completedLessonIds.includes(lesson._id);
                                    let isLocked = false;
                                    if (user?.role === 'student' && index > 0) {
                                        if (!completedLessonIds.includes(filteredLessons[index - 1]._id)) {
                                            isLocked = true;
                                        }
                                    }

                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={lesson._id}>
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                            >
                                                <Card sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    borderRadius: '24px',
                                                    overflow: 'hidden',
                                                    border: '1px solid #f1f5f9',
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&:hover': { 
                                                        transform: isLocked ? 'none' : 'translateY(-12px)', 
                                                        boxShadow: isLocked ? 'none' : '0 30px 60px rgba(0, 165, 196, 0.12)',
                                                        borderColor: isLocked ? '#f1f5f9' : '#00A5C4'
                                                    },
                                                    position: 'relative'
                                                }}>
                                                    {/* Admin Actions */}
                                                    {(user?.role === 'super-admin' || user?.role === 'admin') && (
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                position: 'absolute', top: 16, right: 16, zIndex: 10,
                                                                bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                                '&:hover': { bgcolor: 'white' }
                                                            }}
                                                            onClick={(e) => handleMenuOpen(e, lesson)}
                                                        >
                                                            <MoreVertIcon fontSize="small" />
                                                        </IconButton>
                                                    )}

                                                    <Box sx={{ position: 'relative', pt: '56.25%', overflow: 'hidden' }}>
                                                        <CardMedia
                                                            component="img"
                                                            image={getThumbnail(lesson)}
                                                            alt={lesson.title}
                                                            sx={{
                                                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                                                objectFit: 'cover', transition: 'transform 0.8s ease',
                                                                filter: isLocked ? 'grayscale(80%) blur(2px)' : 'none'
                                                            }}
                                                        />
                                                        {isLocked && (
                                                            <Box sx={{ 
                                                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                                                bgcolor: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                            }}>
                                                                <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                                                                    <LockIcon sx={{ color: 'white', fontSize: 24 }} />
                                                                </Box>
                                                            </Box>
                                                        )}
                                                        <Box sx={{ 
                                                            position: 'absolute', bottom: 0, left: 0, right: 0, p: 2,
                                                            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent)'
                                                        }}>
                                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '0.65rem', letterSpacing: 1, opacity: 0.9 }}>
                                                                    DARS #{index + 1}
                                                                </Typography>
                                                                {isCompleted && (
                                                                    <Chip 
                                                                        icon={<CheckCircleIcon style={{ color: 'white', fontSize: 14 }} />}
                                                                        label="Tugallangan" 
                                                                        size="small" 
                                                                        sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 900, border: 'none', height: 20, fontSize: '0.6rem' }} 
                                                                    />
                                                                )}
                                                            </Stack>
                                                        </Box>
                                                    </Box>

                                                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                        <Typography variant="h6" sx={{ 
                                                            fontWeight: 900, 
                                                            mb: 1, 
                                                            color: '#0f172a', 
                                                            lineHeight: 1.3, 
                                                            height: '2.8rem',
                                                            fontSize: '1.05rem',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {lesson.title}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ 
                                                            color: '#64748b', 
                                                            mb: 2, 
                                                            fontWeight: 500, 
                                                            lineHeight: 1.5, 
                                                            height: '2.6rem',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            fontSize: '0.85rem'
                                                        }}>
                                                            {lesson.description || "Ushbu dars orqali siz zamonaviy texnologiyalar haqida tushunchaga ega bo'lasiz."}
                                                        </Typography>

                                                        <Box sx={{ mt: 'auto' }}>
                                                            <Stack direction="row" spacing={1} sx={{ mb: 2, height: 20 }}>
                                                                {lesson.documentUrl && <Chip label="PDF" size="small" sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 800, borderRadius: '6px', fontSize: '0.6rem', height: 20 }} />}
                                                                {lesson.videoUrl && <Chip label="Video" size="small" sx={{ bgcolor: '#f0f9ff', color: '#00A5C4', fontWeight: 800, borderRadius: '6px', fontSize: '0.6rem', height: 20 }} />}
                                                                <Chip label={lesson.category?.split(' ')[0] || 'Mavzu'} size="small" sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 700, borderRadius: '6px', fontSize: '0.6rem', height: 20 }} />
                                                            </Stack>

                                                            <Button
                                                                fullWidth
                                                                variant="contained"
                                                                disabled={isLocked}
                                                                onClick={() => navigate(`/lessons/${lesson._id}`)}
                                                                startIcon={isLocked ? <LockIcon sx={{ fontSize: 16 }} /> : <PlayArrowIcon sx={{ fontSize: 18 }} />}
                                                                sx={{
                                                                    borderRadius: '12px',
                                                                    py: 1.2,
                                                                    fontWeight: 900,
                                                                    textTransform: 'none',
                                                                    fontSize: '0.85rem',
                                                                    bgcolor: isLocked ? '#e2e8f0' : '#00A5C4',
                                                                    boxShadow: isLocked ? 'none' : '0 8px 16px rgba(0, 165, 196, 0.12)',
                                                                    '&:hover': { bgcolor: '#008ba5', boxShadow: '0 12px 24px rgba(0, 165, 196, 0.2)' },
                                                                    '&.Mui-disabled': { bgcolor: '#f1f5f9', color: '#94a3b8' }
                                                                }}
                                                            >
                                                                {isLocked ? "Qulflangan" : "O'qishni boshlash"}
                                                            </Button>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </Grid>
                                    );
                                })}
                            </AnimatePresence>
                        </Grid>
                    )}

                    {!loading && filteredLessons.length === 0 && (
                        <Box sx={{ 
                            textAlign: 'center', py: 15, borderRadius: '32px', 
                            border: '2px dashed #e2e8f0', bgcolor: 'rgba(255,255,255,0.5)', mt: 4 
                        }}>
                            <Typography variant="h5" sx={{ color: '#94a3b8', fontWeight: 800 }}>
                                {searchQuery ? "Hech narsa topilmadi" : "Hozircha darslar mavjud emas"}
                            </Typography>
                        </Box>
                    )}
                </Container>

                {/* Admin Actions Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            borderRadius: '16px', mt: 1, boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            border: '1px solid #f1f5f9', minWidth: 180, p: 0.5
                        }
                    }}
                >
                    <MenuItem onClick={() => { navigate(`/lessons/edit/${selectedLesson?._id}`); handleMenuClose(); }} sx={{ borderRadius: '12px', py: 1.5, fontWeight: 700 }}>
                        <EditOutlinedIcon sx={{ mr: 1.5, color: '#64748b' }} fontSize="small" /> Tahrirlash
                    </MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ borderRadius: '12px', py: 1.5, fontWeight: 700, color: '#ef4444' }}>
                        <DeleteOutlineIcon sx={{ mr: 1.5 }} fontSize="small" /> O'chirish
                    </MenuItem>
                </Menu>
            </Box>
        </NavbarWithDrawer>
    );
};

export default LessonList;

