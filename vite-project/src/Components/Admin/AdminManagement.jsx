import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Card,
    Grid,
    Divider,
    Avatar,
    Chip,
    Tabs,
    Tab,
    Stack,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/Slice/authSlice';
import { useNavigate } from 'react-router-dom';
import NavbarWithDrawer from '../NavDrawer';
import { API_BASE_URL } from '../../config/apiConfig';
import { useTranslation } from 'react-i18next';

const AdminManagement = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [tabValue, setTabValue] = useState(0);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [addingUser, setAddingUser] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'teacher'
    });

    const API_URL = API_BASE_URL + "/";

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = { headers: { 'x-auth-token': user.token } };

            // Stats
            const statsRes = await axios.get(API_URL + 'auth/admin/stats', config);
            setStats(statsRes.data);

            // Users (Super Admin gets all, Admin gets teachers/admins)
            const usersRoute = user.role === 'super-admin' ? 'auth/admin/all-users' : 'auth/users';
            const usersRes = await axios.get(API_URL + usersRoute, config);
            setUsers(usersRes.data);

            // All Courses (Only for Super Admin)
            if (user.role === 'super-admin') {
                const coursesRes = await axios.get(API_URL + 'courses/admin/all-courses', config);
                setCourses(coursesRes.data);
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.msg || err.message;
            const isAuthError = msg.includes('401') ||
                msg.toLowerCase().includes('token') ||
                msg.toLowerCase().includes('ruxsat') ||
                msg.toLowerCase().includes('unauthorized') ||
                msg.toLowerCase().includes('sessiya');

            if (isAuthError) {
                Swal.fire({
                    title: t('session_expired_title'),
                    text: t('session_expired_text'),
                    icon: 'warning',
                    confirmButtonText: 'OK'
                }).then(() => {
                    dispatch(logout());
                    navigate('/login');
                });
            } else {
                Swal.fire(t('error'), t('loading_error'), 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setAddingUser(true);
        try {
            const res = await axios.post(API_URL + 'auth/add-user', formData, {
                headers: { 'x-auth-token': user.token }
            });
            Swal.fire(t('success'), res.data.msg, 'success');
            setFormData({ name: '', email: '', password: '', role: 'teacher' });
            fetchData();
        } catch (err) {
            Swal.fire(t('error'), err.response?.data?.msg || t('signup_error'), 'error');
        } finally {
            setAddingUser(false);
        }
    };

    const handleDeleteUser = async (id) => {
        const result = await Swal.fire({
            title: t('delete_user_confirm'),
            text: t('delete_user_warning'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: t('yes_delete'),
            cancelButtonText: t('cancel')
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(API_URL + `auth/user/${id}`, {
                    headers: { 'x-auth-token': user.token }
                });
                Swal.fire(t('success'), t('user_deleted'), 'success');
                fetchData();
            } catch (err) {
                Swal.fire(t('error'), err.response?.data?.msg || t('user_delete_error'), 'error');
            }
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: 'white', minHeight: '100vh' }}>
            <NavbarWithDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, mt: 8 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#1e293b', display: 'flex', alignItems: 'center' }}>
                    <AdminPanelSettingsIcon sx={{ fontSize: 40, mr: 2, color: '#2563eb' }} />
                    {t('admin_control_title')}
                </Typography>

                {/* Statistics Overview */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}><PeopleIcon /></Avatar>
                            <Box>
                                <Typography variant="caption" color="text.secondary">{t('total_users')}</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{stats?.totalUsers || 0}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><SchoolIcon /></Avatar>
                            <Box>
                                <Typography variant="caption" color="text.secondary">{t('teachers_label')}</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{stats?.teachers || 0}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><PeopleIcon /></Avatar>
                            <Box>
                                <Typography variant="caption" color="text.secondary">{t('students_label')}</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{stats?.students || 0}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}><MenuBookIcon /></Avatar>
                            <Box>
                                <Typography variant="caption" color="text.secondary">{t('courses_label')}</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{courses.length || stats?.courses || 0}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label={t('tab_users')} sx={{ fontWeight: 'bold', textTransform: 'none' }} />
                    <Tab label={t('tab_all_courses')} sx={{ fontWeight: 'bold', textTransform: 'none' }} />
                    <Tab label={t('tab_add_new')} sx={{ fontWeight: 'bold', textTransform: 'none' }} />
                </Tabs>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
                ) : (
                    <>
                        {/* Users Tab */}
                        {tabValue === 0 && (
                            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                <Table>
                                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{t('col_user')}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{t('col_email')}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{t('col_role')}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="right">{t('col_actions')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.map((u) => (
                                            <TableRow key={u._id} hover>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: u.role === 'super-admin' ? '#ef4444' : u.role === 'admin' ? '#f59e0b' : u.role === 'teacher' ? '#3b82f6' : '#10b981' }}>
                                                            {u.name.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{u.name}</Typography>
                                                            <Typography variant="caption" color="text.secondary">ID: {u._id.substring(0, 8)}...</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{u.email}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={u.role.toUpperCase()}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            bgcolor: u.role === 'super-admin' ? 'rgba(239, 68, 68, 0.1)' : u.role === 'admin' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                            color: u.role === 'super-admin' ? '#ef4444' : u.role === 'admin' ? '#f59e0b' : '#3b82f6',
                                                            border: 'none'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    {(user.role === 'super-admin' || (user.role === 'admin' && u.role === 'teacher')) && u.role !== 'super-admin' && (
                                                        <IconButton color="error" size="small" onClick={() => handleDeleteUser(u._id)}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        {/* Courses Tab */}
                        {tabValue === 1 && (
                            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                <Table>
                                    <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{t('col_course_name')}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{t('col_teacher')}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{t('col_students')}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{t('col_code')}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="right">{t('col_actions')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {courses.map((c) => (
                                            <TableRow key={c._id} hover>
                                                <TableCell sx={{ fontWeight: 'medium' }}>{c.title}</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{c.teacher?.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{c.teacher?.email}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={`${c.students?.length} ta`} size="small" variant="outlined" />
                                                </TableCell>
                                                <TableCell>
                                                    <code>{c.joinCode}</code>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small" onClick={() => navigate(`/courses/${c._id}`)}>
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {courses.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                                    {t('no_courses_found')}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        {/* Add User Tab */}
                        {tabValue === 2 && (
                            <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                                        {t('add_user_title')}
                                    </Typography>
                                    <form onSubmit={handleAddUser}>
                                        <Stack spacing={2.5}>
                                            <TextField fullWidth label={t('fullname_input')} name="name" value={formData.name} onChange={handleChange} required />
                                            <TextField fullWidth label={t('col_email')} name="email" type="email" value={formData.email} onChange={handleChange} required />
                                            <TextField fullWidth label={t('password_label')} name="password" type="password" value={formData.password} onChange={handleChange} required />
                                            <FormControl fullWidth>
                                                <InputLabel>{t('col_role')}</InputLabel>
                                                <Select name="role" value={formData.role} label={t('col_role')} onChange={handleChange}>
                                                    <MenuItem value="teacher">{t('teacher_role')}</MenuItem>
                                                    <MenuItem value="admin">{t('role_admin')}</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Button type="submit" variant="contained" size="large" fullWidth disabled={addingUser} sx={{ py: 1.5, borderRadius: 3, fontWeight: 'bold' }}>
                                                {addingUser ? t('adding_user') : t('add_user_btn')}
                                            </Button>
                                        </Stack>
                                    </form>
                                </Paper>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default AdminManagement;
