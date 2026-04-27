import React from 'react';
import { Box, Typography, Container, Grid, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MovieIcon from '@mui/icons-material/Movie';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BoltIcon from '@mui/icons-material/Bolt';
import BarChartIcon from '@mui/icons-material/BarChart';
import featureIcons from '../../assets/branding/features.png';

const Features = () => {
    const features = [
        { icon: <PsychologyIcon sx={{ fontSize: 32 }} />, title: 'Sun\'iy Intellekt', desc: 'AI Tutor yordamida o‘quv jarayonida yuzaga kelgan savollarga real vaqtda javob oling.', color: '#00A5C4' },
        { icon: <AutoStoriesIcon sx={{ fontSize: 32 }} />, title: 'Innovatsion Kontent', desc: 'Raqamli texnologiyalar sohasidagi eng so‘nggi multimodal elektron resurslar to‘plami.', color: '#10b981' },
        { icon: <MovieIcon sx={{ fontSize: 32 }} />, title: 'Interaktiv Video', desc: 'Darslar davomida YouTube va mahalliy videolarni integratsiya qilingan holda ko‘ring.', color: '#8b5cf6' },
        { icon: <LightbulbIcon sx={{ fontSize: 32 }} />, title: 'Amaliy Laboratoriya', desc: 'Nazariy bilimlarni darhol amaliy interaktiv simulyatsiyalarda sinab ko‘rish imkoniyati.', color: '#f59e0b' },
        { icon: <BoltIcon sx={{ fontSize: 32 }} />, title: 'Tezkor O‘zlashtirish', desc: 'Multimodal yondashuv orqali bilimlarni o‘zlashtirish tezligini 40% gacha oshiring.', color: '#ef4444' },
        { icon: <BarChartIcon sx={{ fontSize: 32 }} />, title: 'Aniq Analitika', desc: 'O‘quvchilarning darslarni qanday o‘zlashtirayotganini batafsil diagrammalarda kuzating.', color: '#0f172a' },
    ];

    return (
        <Box sx={{ py: 15, bgcolor: '#FFFFFF' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="overline" sx={{ fontWeight: 800, color: '#00A5C4', letterSpacing: 2 }}>
                            IMKONIYATLAR
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mt: 1, mb: 1.5, letterSpacing: '-1px' }}>
                            Nega Aynan MultiEdu?
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b', maxWidth: '600px', mx: 'auto', fontWeight: 500 }}>
                            Platformamiz eng zamonaviy texnologiyalarni va o‘qitish metodikasini o‘zida mujassam etgan.
                        </Typography>
                    </motion.div>
                </Box>

                <Grid container spacing={3}>
                    {features.map((feature, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                whileHover={{ y: -5 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 5,
                                        height: '100%',
                                        borderRadius: '20px',
                                        bgcolor: '#f8fafc',
                                        border: '1px solid #f1f5f9',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: 'white',
                                            borderColor: '#e2e8f0',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        color: feature.color,
                                        mb: 3,
                                        display: 'inline-flex',
                                        p: 1.5,
                                        borderRadius: '12px',
                                        bgcolor: 'white',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#0f172a' }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7, fontSize: '0.9rem' }}>
                                        {feature.desc}
                                    </Typography>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Decorative image highlight */}
                <Box sx={{ mt: 10, textAlign: 'center', opacity: 0.4 }}>
                    <Box
                        component="img"
                        src={featureIcons}
                        alt="Feature highlights"
                        sx={{ maxWidth: '400px', width: '100%', filter: 'grayscale(1)' }}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default Features;
