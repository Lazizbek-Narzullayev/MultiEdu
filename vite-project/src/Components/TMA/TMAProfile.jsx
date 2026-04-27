import React from 'react';
import { 
    Box, 
    Typography, 
    Avatar, 
    Paper, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    Button,
    Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/Slice/authSlice';
import { useNavigate } from 'react-router-dom';

const TMAProfile = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('warning');
        dispatch(logout());
        navigate('/login');
    };

    return (
        <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
            <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
                <Avatar 
                    src={user?.avatar || "/default-avatar.png"} 
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2, border: '4px solid white', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                />
                <Typography variant="h5" sx={{ fontWeight: 900 }}>{user?.name}</Typography>
                <Typography variant="body2" color="text.secondary">{user?.role === 'student' ? 'Talaba' : 'O\'qituvchi'}</Typography>
            </Box>

            <Paper sx={{ borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <List disablePadding>
                    <ListItem button onClick={() => navigate('/settings')}>
                        <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Profil sozlamalari" secondary="Email va parolni o'zgartirish" />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem button>
                        <ListItemIcon><SecurityIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Xavfsizlik" secondary="Telegram ulanish holati" />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem button onClick={handleLogout} sx={{ color: 'error.main' }}>
                        <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                        <ListItemText primary="Tizimdan chiqish" />
                    </ListItem>
                </List>
            </Paper>

            <Box sx={{ mt: 4, textAlign: 'center', opacity: 0.5 }}>
                <Typography variant="caption">MultiEdu v2.1.0 • Telegram Mini App</Typography>
            </Box>
        </Box>
    );
};

export default TMAProfile;
