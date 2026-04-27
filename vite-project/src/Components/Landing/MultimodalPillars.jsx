import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import MovieIcon from '@mui/icons-material/Movie';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const MultimodalPillars = () => {
    const pillars = [
        {
            icon: <MovieIcon sx={{ fontSize: 40 }} />,
            title: 'Visual',
            desc: 'Video darslar va vizual materiallar orqali ko\'rish qobiliyatini ishga soling.',
            color: '#3b82f6'
        },
        {
            icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
            title: 'Auditory',
            desc: 'Audio podkastlar va ovozli tushuntirishlar bilan tinglab o\'rganing.',
            color: '#10b981'
        },
        {
            icon: <AutoStoriesIcon sx={{ fontSize: 40 }} />,
            title: 'Read/Write',
            desc: "Ma'ruza matnlari va elektron kitoblar bilan o'qib bilimingizni mustahkamlang.",
            color: '#f59e0b'
        },
        {
            icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
            title: 'Kinesthetic',
            desc: 'Interaktiv simulyatsiyalar va laboratoriyalar orqali amalda sinab ko\'ring.',
            color: '#ef4444'
        },
    ];

    return (
        <Box id="pillars-section" sx={{ py: 15, bgcolor: '#f8fafc' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 2, letterSpacing: '-1px' }}>
                            Bilim olishning 4 xil usuli
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b', maxWidth: '700px', mx: 'auto', fontWeight: 500 }}>
                            Har bir o‘quvchi o‘ziga xos tarzda bilim oladi. Biz hamma uchun qulay multimodal platformani taqdim etamiz.
                        </Typography>
                    </motion.div>
                </Box>

                <Grid container spacing={4}>
                    {pillars.map((pillar, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 6,
                                        height: '100%',
                                        textAlign: 'center',
                                        borderRadius: '24px',
                                        bgcolor: '#ffffff',
                                        border: `1px solid #e2e8f0`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: `0 20px 40px rgba(0,0,0,0.06)`,
                                            borderColor: pillar.color,
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        color: pillar.color,
                                        mb: 3,
                                        display: 'inline-flex',
                                        p: 2,
                                        borderRadius: '20px',
                                        bgcolor: `${pillar.color}10`
                                    }}>
                                        {pillar.icon}
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#0f172a' }}>
                                        {pillar.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.7, fontSize: '0.95rem' }}>
                                        {pillar.desc}
                                    </Typography>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default MultimodalPillars;
