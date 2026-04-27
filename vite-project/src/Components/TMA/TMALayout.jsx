import React, { useState, useEffect } from 'react';
import { 
    Box, 
    BottomNavigation, 
    BottomNavigationAction, 
    Paper, 
    ThemeProvider, 
    createTheme,
    CssBaseline,
    Container,
    IconButton,
    Typography,
    AppBar,
    Toolbar,
    useMediaQuery
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const TMALayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const tg = window.Telegram?.WebApp;
    const isMobile = useMediaQuery('(max-width:600px)');

    // Sync state with location
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (location.pathname.includes('/tma/courses')) setValue(1);
        else if (location.pathname.includes('/tma/notifications')) setValue(2);
        else if (location.pathname.includes('/tma/profile')) setValue(3);
        else setValue(0);
    }, [location.pathname]);

    // Telegram Theme Sync
    useEffect(() => {
        if (tg) {
            tg.ready();
            tg.expand();
            // Set header color to match telegram theme
            tg.setHeaderColor(tg.themeParams.bg_color || '#ffffff');
        }
    }, [tg]);

    const handleHaptic = () => {
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    };

    return (
        <Box sx={{ 
            pb: 10, 
            minHeight: '100vh', 
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <CssBaseline />
            
            {/* Minimal Sticky Header */}
            <AppBar position="sticky" elevation={0} sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.8)', 
                backdropFilter: 'blur(10px)',
                color: 'text.primary',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                            width: 28, 
                            height: 28, 
                            bgcolor: 'primary.main', 
                            borderRadius: 1, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <SchoolIcon sx={{ fontSize: 18, color: 'white' }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -0.5, color: 'primary.main', fontSize: '1.2rem' }}>
                            MultiEdu
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => { handleHaptic(); navigate('/tma/notifications'); }}>
                        <NotificationsIcon fontSize="small" />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm" sx={{ pt: 2, flexGrow: 1 }}>
                <Outlet />
            </Container>

            {/* Creative Bottom Navigation */}
            <Paper sx={{ 
                position: 'fixed', 
                bottom: 16, 
                left: 16, 
                right: 16, 
                borderRadius: 5,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.3)',
                bgcolor: 'rgba(255, 255, 255, 0.9)'
            }} elevation={0}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        handleHaptic();
                        setValue(newValue);
                        switch(newValue) {
                            case 0: navigate('/tma/home'); break;
                            case 1: navigate('/tma/courses'); break;
                            case 2: navigate('/tma/notifications'); break;
                            case 3: navigate('/tma/profile'); break;
                        }
                    }}
                    sx={{ bgcolor: 'transparent', height: 60 }}
                >
                    <BottomNavigationAction label="Asosiy" icon={<HomeIcon />} />
                    <BottomNavigationAction label="Kurslarim" icon={<SchoolIcon />} />
                    <BottomNavigationAction label="Xabarlar" icon={<NotificationsIcon />} />
                    <BottomNavigationAction label="Profil" icon={<PersonIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
};

export default TMALayout;
