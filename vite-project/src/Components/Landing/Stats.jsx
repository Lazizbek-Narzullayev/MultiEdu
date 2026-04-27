import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarIcon from '@mui/icons-material/Star';

const Stats = () => {
    const { t } = useTranslation();

    const stats = [
        { icon: <GroupIcon fontSize="large" />, count: '5,000+', label: t('landing_stats_students'), color: '#00A5C4' },
        { icon: <EmojiEventsIcon fontSize="large" />, count: '1,200+', label: t('landing_stats_graduates'), color: '#10b981' },
        { icon: <MenuBookIcon fontSize="large" />, count: '50+', label: t('landing_stats_courses'), color: '#f59e0b' },
        { icon: <StarIcon fontSize="large" />, count: '4.9', label: t('landing_stats_rating'), color: '#ef4444' },
    ];

    return (
        <Box sx={{ py: 10, bgcolor: '#FFFFFF' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="center">
                    {stats.map((stat, index) => (
                        <Grid size={{ xs: 6, md: 3 }} key={index} textAlign="center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Box sx={{
                                    mb: 2,
                                    display: 'inline-flex',
                                    p: 2,
                                    borderRadius: '16px',
                                    bgcolor: 'white',
                                    color: stat.color,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                                    border: '1px solid #f1f5f9'
                                }}>
                                    {stat.icon}
                                </Box>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    color: '#0f172a',
                                    fontSize: { xs: '1.8rem', md: '2.5rem' },
                                    mb: 0.5
                                }}>
                                    {stat.count}
                                </Typography>
                                <Typography variant="subtitle2" sx={{
                                    color: '#64748b',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1
                                }}>
                                    {stat.label}
                                </Typography>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Stats;
