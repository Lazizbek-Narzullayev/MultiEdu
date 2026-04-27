import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Stack, IconButton } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(state => state.auth);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box
            component={motion.nav}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
                py: isScrolled ? 1.5 : 2.5,
                px: { xs: 1.5, md: 8 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'fixed',
                left: 0,
                right: 0,
                boxSizing: 'border-box',
                top: 0,
                bgcolor: isScrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(10px)' : 'none',
                borderBottom: isScrolled ? '1px solid rgba(226, 232, 240, 0.8)' : 'none',
                transition: 'all 0.3s ease',
                zIndex: 1100,
            }}
        >
            <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #1976d2 0%, #00A5C4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 165, 196, 0.2)'
                }}>
                    <SchoolIcon sx={{ fontSize: 24, color: 'white' }} />
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 900,
                        color: '#0f172a',
                        fontSize: { xs: '1.1rem', md: '1.4rem' },
                        letterSpacing: '-0.5px'
                    }}
                >
                    Multi<Box component="span" sx={{ color: '#00A5C4' }}>Edu</Box>
                </Typography>
            </Box>

            <Stack direction="row" spacing={{ xs: 1, md: 3 }} alignItems="center">
                {isAuthenticated ? (
                    <Button
                        variant="contained"
                        onClick={() => navigate('/dashboard')}
                        sx={{
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            bgcolor: '#0f172a',
                            color: 'white',
                            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                            '&:hover': { bgcolor: '#1e2936', boxShadow: '0 6px 20px rgba(15, 23, 42, 0.3)' }
                        }}
                    >
                        {t('cabinet')}
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="text"
                            onClick={() => navigate('/login')}
                            sx={{
                                fontWeight: 700,
                                color: '#1e293b',
                                textTransform: 'none',
                                px: 2
                            }}
                        >
                            {t('login_btn')}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/signup')}
                            sx={{
                                borderRadius: '10px',
                                fontWeight: 'bold',
                                px: 3,
                                py: 1,
                                textTransform: 'none',
                                bgcolor: '#00A5C4',
                                boxShadow: '0 4px 14px rgba(0, 165, 196, 0.3)',
                                '&:hover': { bgcolor: '#008ba5', boxShadow: '0 6px 20px rgba(0, 165, 196, 0.4)' }
                            }}
                        >
                            {t('signup_btn')}
                        </Button>
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default Header;
