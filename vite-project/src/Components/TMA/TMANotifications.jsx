import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemAvatar, 
    Avatar, 
    Paper,
    Divider,
    IconButton,
    Skeleton
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TMANotifications = () => {
    const { user } = useSelector(state => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/notifications`, {
                    headers: { 'x-auth-token': user.token }
                });
                setNotifications(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [user.token]);

    const handleHaptic = () => {
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    };

    if (loading) {
        return (
            <Box>
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 4, mb: 1.5 }} />
                ))}
            </Box>
        );
    }

    return (
        <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>Bildirishnomalar</Typography>
            
            {notifications.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 6, opacity: 0.6 }}>
                    <NotificationsIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
                    <Typography>Hozircha xabarlar yo'q</Typography>
                </Paper>
            ) : (
                <List sx={{ pt: 0 }}>
                    {notifications.map((n, i) => (
                        <React.Fragment key={n._id}>
                            <Paper 
                                onClick={() => handleHaptic()}
                                sx={{ 
                                    borderRadius: 4, 
                                    mb: 1.5, 
                                    border: '1px solid rgba(0,0,0,0.03)',
                                    overflow: 'hidden',
                                    transition: '0.2s',
                                    '&:active': { transform: 'scale(0.98)' }
                                }}
                                elevation={0}
                            >
                                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: n.isRead ? 'grey.300' : 'primary.main' }}>
                                            <NotificationsIcon fontSize="small" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" sx={{ fontWeight: n.isRead ? 600 : 900 }}>
                                                {n.messageText}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(n.createdAt).toLocaleDateString('uz-UZ')}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </Paper>
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default TMANotifications;
