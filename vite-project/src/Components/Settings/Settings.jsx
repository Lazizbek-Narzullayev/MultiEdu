import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Container,
    Divider,
    Alert,
    CircularProgress,
    ToggleButton,
    ToggleButtonGroup,
    Stack,
    Avatar,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, deleteAccount, logout } from '../../store/Slice/authSlice';
import NavbarWithDrawer from '../NavDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import TranslateIcon from '@mui/icons-material/Translate';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import SettingsIcon from '@mui/icons-material/Settings';
import LanguageIcon from '@mui/icons-material/Language';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import Swal from 'sweetalert2';

const Settings = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);
    const { t, i18n } = useTranslation();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [openDelete, setOpenDelete] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteEmail, setDeleteEmail] = useState('');

    // Telegram State
    const [tgLoading, setTgLoading] = useState(false);
    const [isTgLinked, setIsTgLinked] = useState(false);
    const [tgId, setTgId] = useState(null);

    // Fetch Telegram Status
    useEffect(() => {
        const fetchTgStatus = async () => {
            try {
                const token = user?.token;
                if (!token) return;
                const res = await axios.get(`${API_BASE_URL}/auth/telegram/status`, {
                    headers: { 'x-auth-token': token }
                });
                setIsTgLinked(res.data.isLinked);
                setTgId(res.data.telegramId);
            } catch (err) {
                console.error("Telegram status check error:", err);
            }
        };
        fetchTgStatus();
    }, [user?.token]);

    const handleConnectTelegram = async () => {
        setTgLoading(true);
        try {
            const token = user?.token;
            const res = await axios.post(`${API_BASE_URL}/auth/telegram/generate-token`, {}, {
                headers: { 'x-auth-token': token }
            });

            const botToken = res.data.token;
            const botUsername = "multiedubot"; 

            Swal.fire({
                title: t('telegram_token_generated'),
                icon: 'info',
                timer: 2000,
                showConfirmButton: false
            });

            setTimeout(() => {
                window.open(`https://t.me/${botUsername}?start=${botToken}`, '_blank');
                setTgLoading(false);
            }, 1500);

        } catch (err) {
            Swal.fire(t('error'), err.response?.data?.msg || t('error_update'), 'error');
            setTgLoading(false);
        }
    };

    const handleUnlinkTelegram = async () => {
        const result = await Swal.fire({
            title: t('delete_account_confirm'),
            text: t('unlink_telegram'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t('yes_delete'),
            cancelButtonText: t('cancel'),
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8'
        });

        if (result.isConfirmed) {
            try {
                const token = user?.token;
                await axios.post(`${API_BASE_URL}/auth/telegram/unlink`, {}, {
                    headers: { 'x-auth-token': token }
                });
                setIsTgLinked(false);
                setTgId(null);
                Swal.fire(t('success'), t('telegram_not_connected'), 'success');
            } catch (err) {
                Swal.fire(t('error'), err.response?.data?.msg || t('error_update'), 'error');
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const action = await dispatch(updateProfile({ name, email }));
        if (updateProfile.fulfilled.match(action)) {
            Swal.fire({
                title: t('success'),
                text: t('success_profile_update'),
                icon: 'success',
                confirmButtonColor: '#00A5C4'
            });
        } else {
            Swal.fire(t('error'), action.payload || t('error_update'), 'error');
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteEmail !== user.email) {
            Swal.fire(t('error'), t('invalid_email_delete'), 'error');
            return;
        }

        const result = await Swal.fire({
            title: t('delete_account_confirm'),
            text: t('delete_account_warning_text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3085d6',
            confirmButtonText: t('yes_delete'),
            cancelButtonText: t('cancel')
        });

        if (result.isConfirmed) {
            const action = await dispatch(deleteAccount(deletePassword));
            if (deleteAccount.fulfilled.match(action)) {
                await Swal.fire(t('account_deleted_title'), t('account_deleted_text'), 'success');
                window.location.href = '/';
            } else {
                Swal.fire(t('error'), action.payload || t('password_invalid'), 'error');
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const sectionVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
    };

    return (
        <NavbarWithDrawer>
            <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 10 }}>
                {/* Header Hero Section - Dark Blue */}
                <Box sx={{ 
                    position: 'relative', 
                    bgcolor: '#0f172a', 
                    pt: { xs: 6, md: 10 }, 
                    pb: { xs: 10, md: 14 }, 
                    px: 3,
                    overflow: 'hidden',
                    backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(0, 165, 196, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)'
                }}>
                    <Container maxWidth="lg">
                        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" spacing={4}>
                            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                    <SettingsIcon sx={{ color: '#00A5C4', fontSize: 24 }} />
                                    <Typography variant="overline" sx={{ color: '#00A5C4', fontWeight: 900, letterSpacing: 4 }}>
                                        PLATFORMA NAZORATI
                                    </Typography>
                                </Stack>
                                <Typography variant="h2" sx={{ color: 'white', fontWeight: 950, mb: 2, letterSpacing: '-0.02em' }}>
                                    {t('settings_title') || 'Sozlamalar'}
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 500, maxWidth: 600 }}>
                                    Shaxsiy profil ma'lumotlarini tahrirlang va platforma tilini o'zingizga qulay qilib sozlang.
                                </Typography>
                            </motion.div>
                            
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                                <Avatar 
                                    src={user?.avatarUrl}
                                    sx={{ 
                                        width: 140, 
                                        height: 140, 
                                        border: '4px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                        fontSize: '4rem',
                                        fontWeight: 900,
                                        bgcolor: '#00A5C4'
                                    }}
                                >
                                    {user?.name?.charAt(0)}
                                </Avatar>
                            </motion.div>
                        </Stack>
                    </Container>
                </Box>

                <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 10 }}>
                    <Grid container spacing={4}>
                        {/* Profile Section */}
                        <Grid item xs={12} md={8}>
                            <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
                                <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                                        <Box sx={{ p: 1.5, borderRadius: '16px', bgcolor: 'rgba(0, 165, 196, 0.1)', color: '#00A5C4' }}>
                                            <PersonIcon />
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                            {t('profile_info') || 'Profil ma\'lumotlari'}
                                        </Typography>
                                    </Stack>

                                    <form onSubmit={handleUpdate}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label={t('fullname')}
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                    InputProps={{
                                                        startAdornment: <BadgeIcon sx={{ color: '#94a3b8', mr: 1.5, fontSize: 20 }} />,
                                                    }}
                                                    sx={{ 
                                                        '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: '#f8fafc' },
                                                        '& .MuiInputLabel-root': { fontWeight: 700 }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label={t('email_address')}
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    InputProps={{
                                                        startAdornment: <EmailIcon sx={{ color: '#94a3b8', mr: 1.5, fontSize: 20 }} />,
                                                    }}
                                                    sx={{ 
                                                        '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: '#f8fafc' },
                                                        '& .MuiInputLabel-root': { fontWeight: 700 }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={loading}
                                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                                    sx={{ 
                                                        py: 1.8, 
                                                        px: 6, 
                                                        borderRadius: '16px', 
                                                        fontWeight: 900, 
                                                        textTransform: 'none',
                                                        bgcolor: '#00A5C4',
                                                        boxShadow: '0 10px 20px rgba(0, 165, 196, 0.15)',
                                                        '&:hover': { bgcolor: '#008ba5', boxShadow: '0 15px 30px rgba(0, 165, 196, 0.25)' }
                                                    }}
                                                >
                                                    {loading ? t('saving') : t('save_changes')}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Paper>
                            </motion.div>
                        </Grid>

                        {/* Side Panels */}
                        <Grid item xs={12} md={4}>
                            <Stack spacing={4}>
                                {/* Language Section */}
                                <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
                                    <Paper sx={{ p: 4, borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                                            <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
                                                <LanguageIcon fontSize="small" />
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                                {t('language_settings') || 'Til sozlamalari'}
                                            </Typography>
                                        </Stack>
                                        
                                        <ToggleButtonGroup
                                            value={i18n.language || 'uz'}
                                            exclusive
                                            onChange={(e, newLang) => { if (newLang) i18n.changeLanguage(newLang); }}
                                            fullWidth
                                            sx={{
                                                bgcolor: '#f8fafc',
                                                p: 0.5,
                                                borderRadius: '16px',
                                                '& .MuiToggleButton-root': {
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    py: 1.5,
                                                    textTransform: 'none',
                                                    fontWeight: 900,
                                                    color: '#64748b',
                                                    '&.Mui-selected': {
                                                        color: 'white',
                                                        bgcolor: '#0f172a',
                                                        '&:hover': { bgcolor: '#1e293b' }
                                                    }
                                                }
                                            }}
                                        >
                                            <ToggleButton value="uz">UZ</ToggleButton>
                                            <ToggleButton value="en">EN</ToggleButton>
                                            <ToggleButton value="ru">RU</ToggleButton>
                                        </ToggleButtonGroup>
                                    </Paper>
                                </motion.div>

                                {/* Telegram Integration */}
                                <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
                                    <Paper sx={{ p: 4, borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', position: 'relative', overflow: 'hidden' }}>
                                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                                            <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(0, 136, 204, 0.1)', color: '#0088cc' }}>
                                                <TelegramIcon fontSize="small" />
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                                Telegram
                                            </Typography>
                                        </Stack>

                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 1 }}>
                                                {isTgLinked ? `Ulangan: ID ${tgId}` : "Ulanmagan"}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                                Bot orqali yangi bildirishnomalarni telefoningizga oling.
                                            </Typography>
                                        </Box>

                                        {isTgLinked ? (
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={handleUnlinkTelegram}
                                                startIcon={<LinkOffIcon />}
                                                sx={{ borderRadius: '14px', py: 1.2, fontWeight: 800, textTransform: 'none', borderColor: '#ef4444', color: '#ef4444', '&:hover': { borderColor: '#dc2626', bgcolor: '#fef2f2' } }}
                                            >
                                                Uzish
                                            </Button>
                                        ) : (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={handleConnectTelegram}
                                                disabled={tgLoading}
                                                startIcon={tgLoading ? <CircularProgress size={16} color="inherit" /> : <TelegramIcon />}
                                                sx={{ borderRadius: '14px', py: 1.5, fontWeight: 900, textTransform: 'none', bgcolor: '#0088cc', boxShadow: '0 8px 16px rgba(0, 136, 204, 0.15)', '&:hover': { bgcolor: '#0077b5' } }}
                                            >
                                                Botga ulanish
                                            </Button>
                                        )}
                                    </Paper>
                                </motion.div>

                                {/* Danger Zone */}
                                <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
                                    <Paper sx={{ p: 4, borderRadius: '32px', bgcolor: '#fff1f2', border: '1px solid #ffe4e6' }}>
                                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                            <DeleteForeverIcon sx={{ color: '#e11d48' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#9f1239' }}>
                                                Xavfli hudud
                                            </Typography>
                                        </Stack>
                                        <Typography variant="caption" sx={{ color: '#be123c', display: 'block', mb: 3, fontWeight: 600 }}>
                                            Hisobingizni o'chirish qaytarib bo'lmas jarayon hisoblanadi.
                                        </Typography>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="error"
                                            onClick={() => setOpenDelete(true)}
                                            sx={{ borderRadius: '14px', py: 1.2, fontWeight: 900, textTransform: 'none', bgcolor: '#e11d48', boxShadow: '0 8px 16px rgba(225, 29, 72, 0.1)', '&:hover': { bgcolor: '#be123c' } }}
                                        >
                                            Hisobni o'chirish
                                        </Button>
                                    </Paper>
                                </motion.div>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>

                {/* Account Deletion Dialog */}
                <Dialog 
                    open={openDelete} 
                    onClose={() => setOpenDelete(false)} 
                    fullWidth 
                    maxWidth="xs"
                    PaperProps={{
                        sx: { borderRadius: '32px', p: 2, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }
                    }}
                >
                    <DialogTitle sx={{ textAlign: 'center', fontWeight: 950, fontSize: '1.5rem', color: '#0f172a' }}>
                        Hisobni o'chirish
                    </DialogTitle>
                    <DialogContent sx={{ mt: 1 }}>
                        <Alert severity="error" sx={{ mb: 3, borderRadius: '16px', fontWeight: 600 }}>
                            Haqiqatan ham barcha ma'lumotlaringizni o'chirib tashlamoqchimisiz?
                        </Alert>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="Email manzilingiz"
                                placeholder={user?.email}
                                value={deleteEmail}
                                onChange={(e) => setDeleteEmail(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Parolingiz"
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 1 }}>
                        <Button fullWidth onClick={() => setOpenDelete(false)} sx={{ borderRadius: '12px', textTransform: 'none', color: '#64748b', fontWeight: 900 }}>Bekor qilish</Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            disabled={!deleteEmail || !deletePassword || loading}
                            onClick={handleDeleteAccount}
                            sx={{ borderRadius: '12px', fontWeight: 900, textTransform: 'none', py: 1.5, bgcolor: '#e11d48' }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Tasdiqlash"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </NavbarWithDrawer>
    );
};

export default Settings;
