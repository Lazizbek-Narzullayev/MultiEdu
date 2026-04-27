import React from 'react';
import { Box, Typography, Container, Grid, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
    const { t } = useTranslation();

    const steps = [
        {
            number: '01',
            title: 'Ro‘yxatdan o‘tish',
            desc: 'Platformada o‘zingizga mos rolni (talaba yoki o‘qituvchi) tanlab ro‘yxatdan o‘ting.',
            color: '#00A5C4'
        },
        {
            number: '02',
            title: 'Kurs tanlash',
            desc: 'Raqamli texnologiyalar sohasidagi o‘zingizga qiziq bo‘lgan multimodal kursni tanlang.',
            color: '#8b5cf6'
        },
        {
            number: '03',
            title: 'Innovatsion o‘rganish',
            desc: 'Video, audio, matn va interaktiv materiallar orqali fanlarni oson o‘zlashtiring.',
            color: '#10b981'
        },
        {
            number: '04',
            title: 'Natijalarni kuzatish',
            desc: 'O‘zlashtirish darajangizni va yutuqlaringizni real vaqtda kuzatib boring.',
            color: '#ef4444'
        },
    ];

    return (
        <Box sx={{ py: 15, bgcolor: '#f8fafc' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="overline" sx={{ fontWeight: 800, color: '#00A5C4', letterSpacing: 2 }}>
                            JARAYON
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mt: 1, mb: 1.5, letterSpacing: '-1px' }}>
                            Qanday ishlaydi?
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b', maxWidth: '600px', mx: 'auto', fontWeight: 500 }}>
                            MultiEdu platformasidan foydalanish juda oddiy va qulay.
                        </Typography>
                    </motion.div>
                </Box>

                <Grid container spacing={4}>
                    {steps.map((step, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <Box sx={{ position: 'relative', textAlign: { xs: 'center', md: 'left' } }}>
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            fontWeight: 900,
                                            color: `${step.color}15`,
                                            fontSize: '6rem',
                                            lineHeight: 1,
                                            mb: -4,
                                            position: 'relative',
                                            zIndex: 0,
                                            fontFamily: 'monospace'
                                        }}
                                    >
                                        {step.number}
                                    </Typography>
                                    <Box sx={{ position: 'relative', zIndex: 1, pl: { md: 2 } }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#0f172a' }}>
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7, fontSize: '0.95rem' }}>
                                            {step.desc}
                                        </Typography>
                                    </Box>

                                    {/* Connectivity lines for desktop */}
                                    {i < steps.length - 1 && (
                                        <Box sx={{
                                            display: { xs: 'none', md: 'block' },
                                            position: 'absolute',
                                            top: '30%',
                                            right: '-20%',
                                            width: '40%',
                                            height: '2px',
                                            background: `linear-gradient(90deg, ${step.color}40 0%, transparent 100%)`,
                                            zIndex: 0
                                        }} />
                                    )}
                                </Box>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default HowItWorks;
