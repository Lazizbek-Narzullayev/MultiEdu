import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Rating,
    Paper,
    Divider
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const ReviewForm = () => {
    const { user } = useSelector((state) => state.auth);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/reviews`, { rating, comment }, {
                headers: { 'x-auth-token': user.token }
            });
            Swal.fire('Rahmat!', 'Fikringiz muvaffaqiyatli yuborildi va asosiy sahifada ko\'rinadi.', 'success');
            setComment('');
            setRating(5);
        } catch (err) {
            console.error('Review submit error:', err);
            Swal.fire('Xato', 'Fikringizni yuborishda xatolik yuz berdi.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Platforma haqida fikringiz
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Sizning fikringiz biz uchun juda muhim va asosiy sahifada ko'rsatiladi.
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                    <Typography component="legend">Reyting bering</Typography>
                    <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                        size="large"
                    />
                </Box>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Fikringizni yozing..."
                    variant="outlined"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    sx={{ mb: 3 }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ borderRadius: 2, px: 5 }}
                >
                    {loading ? 'Yuborilmoqda...' : 'Yuborish'}
                </Button>
            </form>
        </Paper>
    );
};

export default ReviewForm;
