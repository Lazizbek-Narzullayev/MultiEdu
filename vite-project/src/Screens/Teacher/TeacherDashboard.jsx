import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    Avatar,
    Card,
    CardContent,
    Stack,
    Divider,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Collapse,
    Button,
    LinearProgress,
    Container
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getMyCourses, getTeacherDetailedStats } from '../../store/Slice/courseSlice';
import { getTeacherStats } from '../../store/Slice/submissionSlice';
import { 
    School as SchoolIcon, 
    People as PeopleIcon, 
    EmojiEvents as EmojiEventsIcon, 
    TrendingUp as TrendingUpIcon, 
    KeyboardArrowDown as KeyboardArrowDownIcon, 
    KeyboardArrowUp as KeyboardArrowUpIcon, 
    Visibility as VisibilityIcon,
    AutoGraph as AutoGraphIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircle as CheckCircleIcon,
    Star as StarIcon
} from '@mui/icons-material';
import NavbarWithDrawer from '../../Components/NavDrawer';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const CourseRow = (props) => {
    const { course } = props;
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <TableRow 
                sx={{ 
                    '& > *': { borderBottom: 'unset' }, 
                    cursor: 'pointer', 
                    '&:hover': { bgcolor: 'rgba(124, 58, 237, 0.02)' },
                    transition: '0.3s'
                }} 
                onClick={() => setOpen(!open)}
            >
                <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); setOpen(!open); }} sx={{ color: '#94a3b8' }}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar variant="rounded" src={course.bannerUrl} sx={{ width: 48, height: 48, borderRadius: '12px', border: '1px solid #f1f5f9' }}>{course.title.charAt(0)}</Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 900, color: '#1e293b', fontSize: '0.95rem' }}>{course.title}</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>ID: {course._id.substring(0, 8).toUpperCase()}</Typography>
                        </Box>
                    </Stack>
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Typography sx={{ fontWeight: 900, color: '#1e293b' }}>{course.studentCount}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Typography sx={{ fontWeight: 900, color: '#1e293b' }}>{course.totalLessons}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
                        <Typography sx={{ fontWeight: 900, color: '#7c3aed' }}>{course.averageMastery}%</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={course.averageMastery}
                            sx={{ 
                                width: 80, 
                                height: 8, 
                                borderRadius: 4, 
                                bgcolor: '#f1f5f9', 
                                '& .MuiLinearProgress-bar': { bgcolor: '#7c3aed', borderRadius: 4 } 
                            }}
                        />
                    </Box>
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course._id}`); }}
                        sx={{ 
                            borderRadius: '10px', 
                            textTransform: 'none', 
                            fontWeight: 900, 
                            bgcolor: '#f3e8ff',
                            color: '#7c3aed',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#7c3aed', color: '#fff', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)' }
                        }}
                    >
                        Tafsilotlar
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2, p: 4, bgcolor: '#fcfdff', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                            <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontWeight: 900, mb: 3, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
                                {t('topic_analysis') || 'Mavzular tahlili'}
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900, color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>{t('col_topic_name') || 'Mavzu nomi'}</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }} align="right">{t('col_view_count') || 'Ko\'rishlar'}</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }} align="right">{t('col_activity_percent') || 'Faollik %'}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {course.lessons.map((lesson) => (
                                        <TableRow key={lesson._id}>
                                            <TableCell component="th" scope="row" sx={{ color: '#1e293b', fontWeight: 800, py: 2, borderBottom: '1px solid #f1f5f9' }}>{lesson.title}</TableCell>
                                            <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                                                    <VisibilityIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                                    <Typography variant="body2" sx={{ color: '#475569', fontWeight: 800 }}>{lesson.viewCount}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 900, color: '#7c3aed' }}>
                                                    {course.studentCount > 0 ? Math.round((lesson.viewCount / course.studentCount) * 100) : 0}%
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {course.lessons.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ py: 4, color: '#94a3b8', fontWeight: 800, border: 'none' }}>{t('no_topics_added') || 'Mavzular yo\'q'}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const TeacherDashboard = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courses, detailedStats, loading: coursesLoading } = useSelector((state) => state.courses);
    const { teacherStats } = useSelector((state) => state.submissions);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMyCourses());
        dispatch(getTeacherStats());
        dispatch(getTeacherDetailedStats());
    }, [dispatch]);

    const StatCard = ({ title, value, icon, color, subValue }) => (
        <Card sx={{
            borderRadius: '24px',
            border: '1px solid #f1f5f9',
            height: '100%',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Box sx={{ position: 'absolute', top: 0, right: 0, w: 100, h: 100, bgcolor: `${color}05`, borderRadius: '0 0 0 100%', pointerEvents: 'none' }} />
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Avatar sx={{ 
                        bgcolor: `${color}10`, 
                        color: color, 
                        width: 56, 
                        height: 56,
                        borderRadius: '16px',
                        border: `1px solid ${color}20`
                    }}>
                        {icon}
                    </Avatar>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', mb: 0.5, letterSpacing: -1 }}>{value}</Typography>
                        <Typography sx={{ color: '#64748b', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>{title}</Typography>
                    </Box>
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: '#10b981' }} />
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800 }}>{subValue || 'Faollik ko\'rsatkichi'}</Typography>
                </Stack>
            </CardContent>
        </Card>
    );

    if (coursesLoading) {
        return (
            <NavbarWithDrawer>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%', bgcolor: 'white' }}>
                    <CircularProgress sx={{ color: '#7c3aed' }} />
                </Box>
            </NavbarWithDrawer>
        );
    }

    const totalStudents = courses.reduce((acc, course) => acc + (course.students?.length || 0), 0);
    const totalLessons = courses.reduce((acc, course) => acc + (course.lessons?.length || 0), 0);

    return (
        <NavbarWithDrawer>
            <Box sx={{ minHeight: '100vh', py: { xs: 6, md: 8 }, bgcolor: 'white' }}>
                <Container maxWidth="xl">
                    <Box sx={{ mb: 8, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 4 }}>
                        <Box>

                            <Typography variant="h2" sx={{ fontWeight: 950, color: '#1e293b', letterSpacing: -1.5 }}>
                                {t('teacher_stats_title') || 'O\'qituvchi Paneli'}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500, mt: 1 }}>
                                {t('teacher_stats_desc') || 'Talabalar yutuqlari va tizim monitoringi markazi.'}
                            </Typography>
                        </Box>
                        
                        <Button
                            variant="contained"
                            startIcon={<AutoGraphIcon />}
                            sx={{
                                borderRadius: '16px',
                                px: 4,
                                py: 2,
                                fontWeight: 900,
                                bgcolor: '#7c3aed',
                                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.25)',
                                '&:hover': { bgcolor: '#6d28d9' }
                            }}
                        >
                            Hisobot Yuklash
                        </Button>
                    </Box>

                    <Grid container spacing={4} sx={{ mb: 10 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title={t('total_courses') || 'Kurslar'} value={courses.length} icon={<SchoolIcon sx={{ fontSize: 32 }} />} color="#7c3aed" subValue="+2 yangi kurs" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title={t('total_students') || 'Talabalar'} value={totalStudents} icon={<PeopleIcon sx={{ fontSize: 32 }} />} color="#10b981" subValue="95% faol" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title={t('total_lessons') || 'Darslar'} value={totalLessons} icon={<TrendingUpIcon sx={{ fontSize: 32 }} />} color="#3b82f6" subValue="148 ta dars" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title={t('avg_mastery') || 'O\'zlashtirish'} value={`${teacherStats.averageMastery || 0}%`} icon={<EmojiEventsIcon sx={{ fontSize: 32 }} />} color="#f59e0b" subValue="Yuqori natija" />
                        </Grid>
                    </Grid>

                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Paper
                                sx={{
                                    borderRadius: '32px',
                                    border: '1px solid #f1f5f9',
                                    bgcolor: '#fff',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
                                }}
                            >
                                <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box sx={{ w: 48, h: 48, borderRadius: '14px', bgcolor: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <TrendingUpIcon sx={{ color: '#7c3aed' }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b' }}>
                                            {t('deep_analysis') || 'Chuqur tahlil'}
                                        </Typography>
                                    </Stack>
                                    <Button variant="ghost" sx={{ fontWeight: 900, color: '#7c3aed' }}>Hammasi</Button>
                                </Box>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#fcfdff' }}>
                                                <TableCell />
                                                <TableCell sx={{ color: '#94a3b8', fontWeight: 900, borderBottom: 'none', py: 3 }}>{t('col_course_name') || 'KURS NOMI'}</TableCell>
                                                <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 900, borderBottom: 'none' }}>{t('col_students_count') || 'TALABALAR'}</TableCell>
                                                <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 900, borderBottom: 'none' }}>{t('col_lessons_count') || 'DARSLAR'}</TableCell>
                                                <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 900, borderBottom: 'none' }}>{t('col_mastery') || 'O\'ZLASHTIRISH'}</TableCell>
                                                <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 900, borderBottom: 'none' }}>{t('col_actions') || 'AMALLAR'}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {detailedStats.map((row) => (
                                                <CourseRow key={row._id} course={row} />
                                            ))}
                                            {detailedStats.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 15, border: 'none' }}>
                                                        <Typography sx={{ color: '#cbd5e1', fontWeight: 800 }}>
                                                            {t('no_courses_added') || 'Hech qanday kurs topilmadi'}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </NavbarWithDrawer>
    );
};

export default TeacherDashboard;
