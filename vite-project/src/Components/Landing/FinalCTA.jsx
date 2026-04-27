import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FinalCTA = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Box sx={{
            py: 15,
            bgcolor: '#0f172a',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background pattern */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.05,
                backgroundImage: 'radial-gradient(#00A5C4 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                zIndex: 0
            }} />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-1px' }}>
                        Bilim olishning yangi darajasiga tayyormisiz?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 6, color: '#94a3b8', maxWidth: '600px', mx: 'auto', fontWeight: 500 }}>
                        Hoziroq MultiEdu jamoasiga qo‘shiling va multimodal ta’limning barcha imkoniyatlaridan foydalanishni boshlang.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/signup')}
                        sx={{
                            bgcolor: '#00A5C4',
                            color: 'white',
                            px: 10,
                            py: 2.5,
                            borderRadius: '16px',
                            fontWeight: 800,
                            fontSize: '1.2rem',
                            textTransform: 'none',
                            boxShadow: '0 20px 40px rgba(0, 165, 196, 0.4)',
                            '&:hover': { bgcolor: '#008ba5', boxShadow: '0 25px 50px rgba(0, 165, 196, 0.5)' }
                        }}
                    >
                        Ro‘yxatdan o‘tish
                    </Button>
                </motion.div>
            </Container>
        </Box>
    );
};

export default FinalCTA;
