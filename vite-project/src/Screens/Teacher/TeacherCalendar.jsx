import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Divider,
    Stack,
    Container,
    Avatar
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getMyCourses } from '../../store/Slice/courseSlice';
import { getCourseAssignments } from '../../store/Slice/assignmentSlice';
import { 
    Event as EventIcon, 
    Assignment as AssignmentIcon, 
    CalendarMonth as CalendarIcon,
    History as HistoryIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import NavbarWithDrawer from '../../Components/NavDrawer';
import { useTranslation } from 'react-i18next';

const TeacherCalendar = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { courses, loading: coursesLoading } = useSelector((state) => state.courses);
    const [allAssignments, setAllAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            const { payload: teacherCourses } = await dispatch(getMyCourses());

            if (teacherCourses && Array.isArray(teacherCourses)) {
                let assignmentsCollected = [];
                for (const course of teacherCourses) {
                    const { payload: courseAssignments } = await dispatch(getCourseAssignments(course._id));
                    if (courseAssignments && Array.isArray(courseAssignments)) {
                        assignmentsCollected = [...assignmentsCollected, ...courseAssignments.map(a => ({ ...a, courseTitle: course.title }))];
                    }
                }
                assignmentsCollected.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                setAllAssignments(assignmentsCollected);
            }
            setLoading(false);
        };

        fetchAllData();
    }, [dispatch]);

    if (loading || coursesLoading) {
        return (
            <NavbarWithDrawer>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%', bgcolor: '#f8fafc' }}>
                    <CircularProgress color="primary" />
                </Box>
            </NavbarWithDrawer>
        );
    }

    return (
        <NavbarWithDrawer>
            <Box sx={{ minHeight: '100vh', py: { xs: 4, md: 6 }, bgcolor: '#f1f5f9' }}>
                <Container maxWidth="lg">
                    {/* Header Section */}
                    <Box sx={{ mb: 6, textAlign: 'center' }}>
                        <Box sx={{ display: 'inline-flex', p: 1, bgcolor: '#fff', color: '#1976d2', borderRadius: 1, mb: 2, border: '1px solid #e2e8f0' }}>
                            <CalendarIcon fontSize="medium" />
                        </Box>
                        <Typography variant="h3" sx={{ 
                            fontWeight: 'bold', 
                            color: '#0f172a', 
                            mb: 1
                        }}>
                            {t('calendar_title') || 'Kalendar'}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b' }}>
                            {t('calendar_desc') || 'Yaqinlashib kelayotgan muhim muddatlar va topshiriqlar ro\'yxati'}
                        </Typography>
                    </Box>

                    {/* Upcoming Deadlines Paper */}
                    <Paper 
                        elevation={1}
                        sx={{ 
                            p: { xs: 3, md: 4 }, 
                            borderRadius: 1, 
                            border: '1px solid #e2e8f0',
                            bgcolor: '#ffffff',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                            <Avatar sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2', width: 40, height: 40 }}>
                                <HistoryIcon />
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                                {t('upcoming_deadlines') || 'Kelgusi muddatlar'}
                            </Typography>
                        </Box>

                        <List sx={{ p: 0 }}>
                            {allAssignments.map((assignment, index) => {
                                const isOverdue = new Date(assignment.dueDate) < new Date();
                                return (
                                    <React.Fragment key={assignment._id}>
                                        <ListItem 
                                            sx={{ 
                                                py: 3, 
                                                px: 0,
                                                display: 'flex',
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                alignItems: { xs: 'flex-start', sm: 'center' },
                                                gap: 2,
                                                '&:hover': { bgcolor: '#f8fafc' },
                                                transition: '0.2s'
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 'auto' }}>
                                                <Box sx={{
                                                    p: 1.5,
                                                    borderRadius: 1,
                                                    bgcolor: isOverdue ? 'rgba(211, 47, 47, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                                                    color: isOverdue ? '#d32f2f' : '#1976d2',
                                                    border: '1px solid #e2e8f0'
                                                }}>
                                                    <AssignmentIcon fontSize="medium" />
                                                </Box>
                                            </ListItemIcon>
                                            
                                            <ListItemText
                                                primary={
                                                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1e293b' }}>
                                                        {assignment.title}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Stack direction="row" spacing={2} sx={{ mt: 1, alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                                        <Chip 
                                                            size="small" 
                                                            label={assignment.courseTitle} 
                                                            sx={{ 
                                                                bgcolor: '#f1f5f9', 
                                                                color: '#64748b', 
                                                                fontWeight: 'bold',
                                                                borderRadius: 1,
                                                                border: '1px solid #e2e8f0'
                                                            }} 
                                                        />
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <CalendarIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                                            <Typography variant="caption" sx={{ color: isOverdue ? '#d32f2f' : '#64748b', fontWeight: 'bold' }}>
                                                                {t('deadline_label') || 'Muddati'}: {new Date(assignment.dueDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language === 'ru' ? 'ru-RU' : 'uz-UZ')}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                }
                                            />

                                            {isOverdue && (
                                                <Chip 
                                                    icon={<WarningIcon sx={{ fontSize: '0.9rem !important', color: '#fff !important' }} />}
                                                    label={t('overdue_label') || 'Muddati o\'tgan'} 
                                                    size="small" 
                                                    sx={{ 
                                                        bgcolor: '#d32f2f',
                                                        color: '#fff',
                                                        fontWeight: 'bold',
                                                        borderRadius: 1
                                                    }} 
                                                />
                                            )}
                                        </ListItem>
                                        {index < allAssignments.length - 1 && (
                                            <Divider />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                            
                            {allAssignments.length === 0 && (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Avatar sx={{ 
                                        width: 64, 
                                        height: 64, 
                                        bgcolor: '#f8fafc', 
                                        color: '#cbd5e1', 
                                        mx: 'auto', 
                                        mb: 2,
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <EventIcon sx={{ fontSize: 32 }} />
                                    </Avatar>
                                    <Typography sx={{ color: '#94a3b8', fontWeight: 'bold' }}>
                                        {t('no_assignments_scheduled') || 'Hozircha hech qanday topshiriq rejalashtirilmagan'}
                                    </Typography>
                                </Box>
                            )}
                        </List>
                    </Paper>
                </Container>
            </Box>
        </NavbarWithDrawer>
    );
};

export default TeacherCalendar;
