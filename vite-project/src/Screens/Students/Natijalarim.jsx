import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Container, Paper, Grid, CircularProgress,
    LinearProgress, Card, Divider, Chip, List, ListItem,
    ListItemText, ListItemIcon, Avatar, Stack, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../config/apiConfig';
import NavbarWithDrawer from '../../Components/NavDrawer';
import {
    EmojiEvents as EmojiEventsIcon,
    MenuBook as MenuBookIcon,
    Quiz as QuizIcon,
    Assignment as AssignmentIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    School as SchoolIcon,
    TrendingUp as TrendingUpIcon,
    Star as StarIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Natijalarim = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: '', items: [], type: '' });

    const openViewAll = (title, items, type) => {
        setModalData({ title, items, type });
        setModalOpen(true);
    };

    const toggleSection = (courseId, type) => {
        setExpandedSections(prev => ({
            ...prev,
            [`${courseId}-${type}`]: !prev[`${courseId}-${type}`]
        }));
    };

    const fetchProgress = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/students/progress`, {
                headers: { 'x-auth-token': user.token }
            });
            setProgressData(res.data);
        } catch (err) {
            console.error("Xatolik:", err);
            setError(t('loading_error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchProgress();
        }
    }, [user]);

    return (
        <NavbarWithDrawer>
            <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 } }}>
                <Container maxWidth="xl">
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 20, gap: 3 }}>
                            <CircularProgress size={60} thickness={5} sx={{ color: '#2563eb' }} />
                            <Typography sx={{ color: '#64748b', fontWeight: 'bold', letterSpacing: 1 }}>
                                {t('loading_results') || 'Natijalar yuklanmoqda...'}
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Avatar sx={{ 
                                    bgcolor: 'rgba(37, 99, 235, 0.1)', 
                                    width: 80, 
                                    height: 80,
                                    border: '1px solid #bae6fd',
                                    borderRadius: 1
                                }}>
                                    <EmojiEventsIcon sx={{ fontSize: 40, color: '#2563eb' }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h2" sx={{ fontWeight: '950', color: '#0f172a', mb: 1 }}>
                                        {t('my_results_title') || 'Mening natijalarim'}
                                    </Typography>
                                    <Typography sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {t('results_monitoring') || 'O\'zlashtirish va test natijalari tahlili'}
                                    </Typography>
                                </Box>
                            </Box>

                            {progressData.length === 0 ? (
                                <Paper className="glass-panel" sx={{ p: 12, textAlign: 'center', borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                                    <SchoolIcon sx={{ fontSize: 100, color: '#e2e8f0', mb: 4 }} />
                                    <Typography variant="h5" sx={{ color: '#94a3b8', fontWeight: 'bold' }}>
                                        {t('no_courses_joined') || 'Siz hali hech qaysi kursga a\'zo emassiz'}
                                    </Typography>
                                </Paper>
                            ) : (
                                <Stack spacing={6}>
                                    {progressData.map((course) => (
                                        <Card key={course.courseId} className="glass-panel" sx={{ 
                                            borderRadius: 1, 
                                            overflow: 'hidden', 
                                            border: '1px solid #e2e8f0',
                                            bgcolor: '#ffffff',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                borderColor: '#2563eb',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                                            }
                                        }}>
                                            <Grid container>
                                                <Grid
                                                    item xs={12} md={4}
                                                    onClick={() => navigate(`/courses/${course.courseId}`)}
                                                    sx={{
                                                        background: '#f8fafc',
                                                        p: 5,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        borderRight: '1px solid #e2e8f0'
                                                    }}
                                                >
                                                    <Typography variant="h4" sx={{ fontWeight: '950', mb: 1, color: '#0f172a' }}>{course.courseTitle}</Typography>
                                                    <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 'bold', mb: 5 }}>{t('teacher_label')}: {course.teacherName}</Typography>

                                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="caption" sx={{ fontWeight: '900', letterSpacing: '1.5px', color: '#94a3b8', textTransform: 'uppercase' }}>
                                                            {t('overall_mastery_upper') || 'UMUMIY O\'ZLASHTIRISH'}
                                                        </Typography>
                                                        <Typography variant="h5" sx={{ fontWeight: '950', color: '#2563eb' }}>{course.overallPercentage}%</Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={course.overallPercentage}
                                                        sx={{
                                                            height: 12,
                                                            borderRadius: 1,
                                                            bgcolor: '#e2e8f0',
                                                            '& .MuiLinearProgress-bar': { 
                                                                background: '#2563eb',
                                                                borderRadius: 1
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={8} sx={{ p: 5 }}>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} sm={6} lg={3}>
                                                            <Box sx={{ p: 2, height: '100%', borderRadius: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar sx={{ p: 1, borderRadius: 1, bgcolor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', width: 40, height: 40 }}>
                                                                    <MenuBookIcon sx={{ fontSize: 20 }} />
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="h6" sx={{ fontWeight: '950', color: '#0f172a', lineHeight: 1 }}>{course.viewedLessonsCount || 0} / {course.totalLessons || 0}</Typography>
                                                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.65rem' }}>{t('topics_viewed', 'Mavzular')}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} lg={3}>
                                                            <Box sx={{ p: 2, height: '100%', borderRadius: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar sx={{ p: 1, borderRadius: 1, bgcolor: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', width: 40, height: 40 }}>
                                                                    <QuizIcon sx={{ fontSize: 20 }} />
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="h6" sx={{ fontWeight: '950', color: '#0f172a', lineHeight: 1 }}>{course.completedQuizzesCount || 0} / {course.totalQuizzes || 0}</Typography>
                                                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.65rem' }}>{t('tests_solved', 'Testlar')}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} lg={3}>
                                                            <Box sx={{ p: 2, height: '100%', borderRadius: 1, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar sx={{ p: 1, borderRadius: 1, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: 40, height: 40 }}>
                                                                    <AssignmentIcon sx={{ fontSize: 20 }} />
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="h6" sx={{ fontWeight: '950', color: '#0f172a', lineHeight: 1 }}>{course.completedAssignmentsCount || 0} / {course.totalAssignments || 0}</Typography>
                                                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.65rem' }}>{t('assignments_done', 'Topshiriqlar')}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} lg={3}>
                                                            <Box sx={{ p: 2, height: '100%', borderRadius: 1, bgcolor: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar sx={{ p: 1, borderRadius: 1, bgcolor: '#2563eb', color: '#fff', width: 40, height: 40 }}>
                                                                    <StarIcon sx={{ fontSize: 20 }} />
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="h6" sx={{ fontWeight: '950', color: '#2563eb', lineHeight: 1 }}>{course.averageGrade}%</Typography>
                                                                    <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.65rem' }}>{t('avg_grade', 'O\'rtacha baho')}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container spacing={4} sx={{ mt: 2 }}>
                                                        <Grid item xs={12} lg={6}>
                                                            <Typography variant="h6" sx={{ fontWeight: '950', mb: 3, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <TrendingUpIcon sx={{ color: '#2563eb' }} /> {t('quiz_results', 'Test natijalari')}
                                                            </Typography>

                                                            {!course.quizAttempts || course.quizAttempts.length === 0 ? (
                                                                <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic', bgcolor: '#f8fafc', p: 3, borderRadius: 1, textAlign: 'center', border: '1px dashed #e2e8f0' }}>
                                                                    {t('no_tests_submitted', 'Hali testlar topshirilmagan.')}
                                                                </Typography>
                                                            ) : (
                                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <List disablePadding sx={{ 
                                                                        gap: 1.5, display: 'flex', flexDirection: 'column',
                                                                        maxHeight: expandedSections[`${course.courseId}-quiz`] ? 300 : 'auto',
                                                                        overflowY: expandedSections[`${course.courseId}-quiz`] ? 'auto' : 'visible',
                                                                        pr: expandedSections[`${course.courseId}-quiz`] ? 1 : 0,
                                                                        '&::-webkit-scrollbar': { width: '4px' },
                                                                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' }
                                                                    }}>
                                                                        {(expandedSections[`${course.courseId}-quiz`] ? course.quizAttempts : course.quizAttempts.slice(0, 2)).map((attempt, idx) => {
                                                                            const isPassed = (attempt.score / attempt.totalQuestions) >= 0.7;
                                                                            return (
                                                                                <ListItem key={idx} sx={{ 
                                                                                    px: 2, py: 1.5, bgcolor: '#ffffff', borderRadius: 1, border: '1px solid #f1f5f9',
                                                                                    transition: '0.3s ease', '&:hover': { bgcolor: '#f8fafc', transform: 'translateX(5px)' }
                                                                                }}>
                                                                                    <ListItemIcon sx={{ minWidth: 35 }}>
                                                                                        <CheckCircleOutlineIcon sx={{ color: isPassed ? "#10b981" : "#f59e0b", fontSize: 20 }} />
                                                                                    </ListItemIcon>
                                                                                    <ListItemText
                                                                                        primary={attempt.quizTitle}
                                                                                        primaryTypographyProps={{ fontWeight: 'bold', color: '#1e293b', fontSize: '0.9rem' }}
                                                                                    />
                                                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                                                        <Chip
                                                                                            label={`${attempt.score} / ${attempt.totalQuestions}`}
                                                                                            size="small"
                                                                                            sx={{ fontWeight: '900', bgcolor: isPassed ? '#f0fdf4' : '#fffbeb', color: isPassed ? '#10b981' : '#f59e0b', borderRadius: 1 }}
                                                                                        />
                                                                                        <Typography variant="body2" sx={{ fontWeight: '950', color: isPassed ? '#10b981' : '#f59e0b', minWidth: 45, textAlign: 'right' }}>
                                                                                            {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                                                                                        </Typography>
                                                                                    </Stack>
                                                                                </ListItem>
                                                                            );
                                                                        })}
                                                                    </List>
                                                                    {course.quizAttempts.length > 2 && (
                                                                        <Button 
                                                                            onClick={() => openViewAll(t('quiz_results', 'Test natijalari'), course.quizAttempts, 'quiz')}
                                                                            sx={{ mt: 1.5, alignSelf: 'center', textTransform: 'none', fontWeight: 'bold', color: '#64748b' }}
                                                                            endIcon={<ExpandMoreIcon />}
                                                                        >
                                                                            {t('show_all', 'Barchasini ko\'rish')}
                                                                        </Button>
                                                                    )}
                                                                </Box>
                                                            )}
                                                        </Grid>

                                                        <Grid item xs={12} lg={6}>
                                                            <Typography variant="h6" sx={{ fontWeight: '950', mb: 3, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <AssignmentIcon sx={{ color: '#f59e0b' }} /> {t('assignment_results', 'Topshiriqlar')}
                                                            </Typography>

                                                            {!course.submissions || course.submissions.length === 0 ? (
                                                                <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic', bgcolor: '#f8fafc', p: 3, borderRadius: 1, textAlign: 'center', border: '1px dashed #e2e8f0' }}>
                                                                    {t('no_assignments_submitted', 'Hali topshiriqlar topshirilmagan.')}
                                                                </Typography>
                                                            ) : (
                                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <List disablePadding sx={{ 
                                                                        gap: 1.5, display: 'flex', flexDirection: 'column',
                                                                        maxHeight: expandedSections[`${course.courseId}-assignment`] ? 300 : 'auto',
                                                                        overflowY: expandedSections[`${course.courseId}-assignment`] ? 'auto' : 'visible',
                                                                        pr: expandedSections[`${course.courseId}-assignment`] ? 1 : 0,
                                                                        '&::-webkit-scrollbar': { width: '4px' },
                                                                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' }
                                                                    }}>
                                                                        {(expandedSections[`${course.courseId}-assignment`] ? course.submissions : course.submissions.slice(0, 2)).map((sub, idx) => {
                                                                            const isGraded = sub.status === 'graded';
                                                                            const percentage = isGraded ? Math.round((sub.score / sub.maxScore) * 100) : 0;
                                                                            return (
                                                                                <ListItem key={idx} sx={{ 
                                                                                    px: 2, py: 1.5, bgcolor: '#ffffff', borderRadius: 1, border: '1px solid #f1f5f9',
                                                                                    transition: '0.3s ease', '&:hover': { bgcolor: '#f8fafc', transform: 'translateX(5px)' }
                                                                                }}>
                                                                                    <ListItemIcon sx={{ minWidth: 35 }}>
                                                                                        <AssignmentIcon sx={{ color: isGraded ? "#10b981" : "#94a3b8", fontSize: 20 }} />
                                                                                    </ListItemIcon>
                                                                                    <ListItemText
                                                                                        primary={sub.title}
                                                                                        primaryTypographyProps={{ fontWeight: 'bold', color: '#1e293b', fontSize: '0.9rem' }}
                                                                                    />
                                                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                                                        {isGraded ? (
                                                                                            <>
                                                                                                <Chip label={`${sub.score} / ${sub.maxScore}`} size="small" sx={{ fontWeight: '900', bgcolor: '#f0fdf4', color: '#10b981', borderRadius: 1 }} />
                                                                                                <Typography variant="body2" sx={{ fontWeight: '950', color: '#10b981', minWidth: 45, textAlign: 'right' }}>{percentage}%</Typography>
                                                                                            </>
                                                                                        ) : (
                                                                                            <Chip label={t('pending', 'Kutilmoqda')} size="small" sx={{ fontWeight: '900', bgcolor: '#fff7ed', color: '#f59e0b', borderRadius: 1 }} />
                                                                                        )}
                                                                                    </Stack>
                                                                                </ListItem>
                                                                            );
                                                                        })}
                                                                    </List>
                                                                    {course.submissions.length > 2 && (
                                                                        <Button 
                                                                            onClick={() => openViewAll(t('assignment_results', 'Topshiriqlar'), course.submissions, 'assignment')}
                                                                            sx={{ mt: 1.5, alignSelf: 'center', textTransform: 'none', fontWeight: 'bold', color: '#64748b' }}
                                                                            endIcon={<ExpandMoreIcon />}
                                                                        >
                                                                            {t('show_all', 'Barchasini ko\'rish')}
                                                                        </Button>
                                                                    )}
                                                                </Box>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    ))}
                                </Stack>
                            )}
                        </>
                    )}
                </Container>
            </Box>

            {/* View All Dialog */}
            <Dialog 
                open={modalOpen} 
                onClose={() => setModalOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: { borderRadius: 1, p: 1 }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontWeight: 950,
                    color: '#0f172a'
                }}>
                    {modalData.title}
                    <IconButton onClick={() => setModalOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <List disablePadding sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
                        {modalData.items.map((item, idx) => {
                            if (modalData.type === 'quiz') {
                                const isPassed = (item.score / item.totalQuestions) >= 0.7;
                                return (
                                    <ListItem key={idx} sx={{ 
                                        px: 2, py: 2, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0'
                                    }}>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <CheckCircleOutlineIcon sx={{ color: isPassed ? "#10b981" : "#f59e0b" }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.quizTitle}
                                            primaryTypographyProps={{ fontWeight: 'bold', color: '#1e293b' }}
                                        />
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Chip
                                                label={`${item.score} / ${item.totalQuestions}`}
                                                size="small"
                                                sx={{ fontWeight: '900', bgcolor: isPassed ? '#f0fdf4' : '#fffbeb', color: isPassed ? '#10b981' : '#f59e0b', borderRadius: 1 }}
                                            />
                                            <Typography variant="body2" sx={{ fontWeight: '950', color: isPassed ? '#10b981' : '#f59e0b', minWidth: 50, textAlign: 'right' }}>
                                                {Math.round((item.score / item.totalQuestions) * 100)}%
                                            </Typography>
                                        </Stack>
                                    </ListItem>
                                );
                            } else {
                                const isGraded = item.status === 'graded';
                                const percentage = isGraded ? Math.round((item.score / item.maxScore) * 100) : 0;
                                return (
                                    <ListItem key={idx} sx={{ 
                                        px: 2, py: 2, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0'
                                    }}>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <AssignmentIcon sx={{ color: isGraded ? "#10b981" : "#94a3b8" }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.title}
                                            primaryTypographyProps={{ fontWeight: 'bold', color: '#1e293b' }}
                                        />
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            {isGraded ? (
                                                <>
                                                    <Chip label={`${item.score} / ${item.maxScore}`} size="small" sx={{ fontWeight: '900', bgcolor: '#f0fdf4', color: '#10b981', borderRadius: 1 }} />
                                                    <Typography variant="body2" sx={{ fontWeight: '950', color: '#10b981', minWidth: 50, textAlign: 'right' }}>{percentage}%</Typography>
                                                </>
                                            ) : (
                                                <Chip label={t('pending', 'Kutilmoqda')} size="small" sx={{ fontWeight: '900', bgcolor: '#fff7ed', color: '#f59e0b', borderRadius: 1 }} />
                                            )}
                                        </Stack>
                                    </ListItem>
                                );
                            }
                        })}
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setModalOpen(false)} variant="contained" sx={{ bgcolor: '#2563eb', textTransform: 'none', borderRadius: 1, px: 4 }}>
                        {t('close_btn', 'Yopish')}
                    </Button>
                </DialogActions>
            </Dialog>
        </NavbarWithDrawer>
    );
};

export default Natijalarim;
