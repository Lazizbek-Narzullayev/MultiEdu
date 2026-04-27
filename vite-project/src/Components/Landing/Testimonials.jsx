import React, { useState } from 'react';
import {
    Box, Typography, Container, Paper, Stack, Avatar, Rating,
    Button, Dialog, DialogContent, DialogTitle, IconButton, Fade
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const Testimonials = ({ reviews = [] }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const staticTestimonials = [
        { user: { name: 'Aziza Rahimova', role: 'student' }, comment: 'MultiEdu orqali fanni o‘rganish mutlaqo yangi darajaga chiqdi. Multimodal resurslar juda tushunarli! Darslar sifati va tushunarli ekanligi meni hayron qoldirdi. Ayniqsa, 3D modellar bilan ishlash juda qiziqarli va foydali bo‘ldi. Har bir mavzu batafsil yoritilgan.', avatar: 'A', rating: 5 },
        { user: { name: 'Jamshid Karimov', role: 'teacher' }, comment: 'O‘z kurslarimni zamonaviy metodlar asosida yaratish uchun eng qulay va innovatsion platforma. Talabalar bilan ishlash va ularning natijalarini kuzatish endi juda oson. Platformaning interfeysi juda qulay va tushunarli.', avatar: 'J', rating: 5 },
        { user: { name: 'Sardorbek Alimov', role: 'student' }, comment: 'AI Tutor va interaktiv laboratoriyalar bilimimni amalda mustahkamlashga yordam berdi. Rahmat! Multimodal o‘quv resurslari orqali murakkab mavzularni oson o‘zlashtirdim.', avatar: 'S', rating: 4.8 },
        { user: { name: 'Dilshod To‘rayev', role: 'student' }, comment: 'Darslar sifati va tushunarli ekanligi meni hayron qoldirdi. Tavsiya qilaman! Platformada har bir fanga tegishli barcha turdagi (matn, video, audio, 3D) resurslar mavjudligi juda qulay.', avatar: 'D', rating: 5 },
        { user: { name: 'Malika Ergasheva', role: 'teacher' }, comment: 'Talabalar bilan ishlash va ularning natijalarini kuzatish endi juda oson. O‘quv jarayonini boshqarish uchun barcha kerakli vositalar bir joyda jamlangan.', avatar: 'M', rating: 5 },
        { user: { name: 'Lazizbek', role: 'teacher' }, comment: 'Juda ajoyib platforma, hamma narsa tushunarli va interaktiv! Innovatsion yondashuv sezilib turibdi.', avatar: 'L', rating: 5 },
    ];

    const displayReviews = reviews.length > 0 ? reviews : staticTestimonials;

    const handleOpen = (review) => {
        setSelectedReview(review);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                            FIKRLAR
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mt: 1, mb: 1.5, letterSpacing: '-1px' }}>
                            Foydalanuvchilarimiz Nima Deydi?
                        </Typography>
                    </motion.div>
                </Box>

                <Box
                    sx={{
                        px: { xs: 0, md: 2 },
                        position: 'relative',
                        "& .swiper": {
                            paddingBottom: "80px !important",
                        },
                        "& .swiper-pagination": {
                            bottom: "10px !important",
                            zIndex: 10,
                        },
                        "& .swiper-pagination-bullet": {
                            width: "12px",
                            height: "6px",
                            borderRadius: "4px",
                            backgroundColor: "#cbd5e1",
                            opacity: 1,
                            transition: "all 0.3s ease",
                        },
                        "& .swiper-pagination-bullet-active": {
                            width: "30px",
                            backgroundColor: "#00A5C4 !important",
                        }
                    }}
                >
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        loop={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        speed={1000}
                        pagination={{ clickable: true }}
                    >
                        {displayReviews.map((review, index) => (
                            <SwiperSlide key={index} style={{ height: 'auto' }}>
                                <Paper
                                    elevation={0}
                                    onClick={() => handleOpen(review)}
                                    sx={{
                                        p: 4,
                                        borderRadius: '28px',
                                        bgcolor: '#f8fafc',
                                        border: '1px solid #f1f5f9',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        minHeight: '340px',
                                        cursor: 'pointer',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            bgcolor: 'white',
                                            borderColor: '#00A5C4',
                                            transform: 'translateY(-10px)',
                                            boxShadow: '0 20px 40px rgba(0, 165, 196, 0.12)'
                                        }
                                    }}
                                >
                                    <Rating value={review.rating || 5} readOnly size="small" sx={{ color: '#00A5C4', mb: 2 }} />

                                    <Typography sx={{
                                        color: '#334155',
                                        mb: 3,
                                        fontStyle: 'italic',
                                        lineHeight: 1.7,
                                        fontSize: '1rem',
                                        flexGrow: 1,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        "{review.comment}"
                                    </Typography>

                                    <Button
                                        size="small"
                                        sx={{
                                            alignSelf: 'flex-start',
                                            mt: -2,
                                            mb: 3,
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            color: '#00A5C4',
                                            p: 0,
                                            '&:hover': { background: 'transparent', textDecoration: 'underline' }
                                        }}
                                    >
                                        To‘liq o‘qish
                                    </Button>

                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 'auto' }}>
                                        <Avatar sx={{
                                            bgcolor: '#00A5C4',
                                            width: 48,
                                            height: 48,
                                            fontWeight: 800,
                                            boxShadow: '0 4px 12px rgba(0, 165, 196, 0.2)'
                                        }}>
                                            {review.user?.name[0]}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                                {review.user?.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                                                {review.user?.role === 'teacher' ? 'O‘qituvchi' : 'Talaba'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Container>

            {/* Testimonial Full Modal */}
            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '32px',
                        p: 2,
                        boxShadow: '0 25px 50px rgba(0,0,0,0.1)'
                    }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: '#00A5C4', width: 56, height: 56, fontWeight: 800 }}>
                            {selectedReview?.user?.name[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                {selectedReview?.user?.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                                {selectedReview?.user?.role === 'teacher' ? 'O‘qituvchi' : 'Talaba'}
                            </Typography>
                        </Box>
                    </Stack>
                    <IconButton onClick={handleClose} sx={{ color: '#64748b' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Rating value={selectedReview?.rating || 5} readOnly sx={{ color: '#00A5C4', mb: 3 }} />
                    <Typography sx={{
                        color: '#1e293b',
                        lineHeight: 1.8,
                        fontSize: '1.1rem',
                        fontStyle: 'italic',
                        fontWeight: 500
                    }}>
                        "{selectedReview?.comment}"
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            onClick={handleClose}
                            sx={{
                                bgcolor: '#0f172a',
                                color: 'white',
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 4,
                                '&:hover': { bgcolor: '#1e2936' }
                            }}
                        >
                            Yopish
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Testimonials;
