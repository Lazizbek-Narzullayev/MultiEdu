import React from 'react';
import { Box, Typography, Button, Container, Grid, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroImage from '../../assets/branding/hero.png';

const Hero = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Box sx={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 100%)',
            pt: { xs: 15, md: 5 },
            pb: 10,
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Subtle background decoration */}
            <Box sx={{
                position: 'absolute',
                top: '10%',
                right: '-5%',
                width: '40%',
                height: '40%',
                background: 'radial-gradient(circle, rgba(0, 165, 196, 0.05) 0%, transparent 70%)',
                zIndex: 0
            }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <Typography
                                variant="overline"
                                sx={{
                                    fontWeight: 800,
                                    color: '#00A5C4',
                                    letterSpacing: 3,
                                    mb: 2,
                                    display: 'block'
                                }}
                            >
                                INNOVATSION TA'LIM PLATFORMASI
                            </Typography>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontWeight: 900,
                                    fontSize: { xs: '2.8rem', sm: '3.8rem', md: '4.5rem' },
                                    mb: 3,
                                    lineHeight: 1.1,
                                    color: '#0f172a',
                                    letterSpacing: '-1.5px'
                                }}
                            >
                                Multimodal o‘quv resurslari orqali
                                <Box component="span" sx={{ color: '#00A5C4', display: 'block' }}>raqamli kelajakni loyihalang</Box>
                            </Typography>

                            <Typography variant="h6" sx={{
                                mb: 6,
                                fontWeight: 500,
                                maxWidth: '600px',
                                mx: { xs: 'auto', md: 0 },
                                color: '#64748b',
                                lineHeight: 1.8,
                                fontSize: '1.1rem'
                            }}>
                                Raqamli texnologiyalar va innovatsiyalar fanidan multimodal elektron o‘quv resurslarini loyihalash va ishlab chiqish platformasi (BMI bitiruv ishi).
                            </Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/signup')}
                                    sx={{
                                        bgcolor: '#00A5C4',
                                        px: 5,
                                        py: 2,
                                        borderRadius: '12px',
                                        fontWeight: 800,
                                        textTransform: 'none',
                                        boxShadow: '0 10px 30px rgba(0, 165, 196, 0.3)',
                                        fontSize: '1.1rem',
                                        '&:hover': { bgcolor: '#008ba5' }
                                    }}
                                >
                                    {t('landing_start_btn')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => document.getElementById('pillars-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    sx={{
                                        color: '#0f172a',
                                        borderColor: '#e2e8f0',
                                        px: 5,
                                        py: 2,
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        fontSize: '1.1rem',
                                        borderWidth: '2px',
                                        bgcolor: 'white',
                                        '&:hover': { borderColor: '#00A5C4', borderWidth: '2px', color: '#00A5C4' }
                                    }}
                                >
                                    Batafsil ma'lumot
                                </Button>
                            </Stack>
                        </motion.div>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        >
                            <Box
                                component="img"
                                src={heroImage}
                                alt="MultiEdu Hero"
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    filter: 'drop-shadow(0 20px 50px rgba(0, 165, 196, 0.15))',
                                    transform: { md: 'scale(1.1)' }
                                }}
                            />
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Hero;
