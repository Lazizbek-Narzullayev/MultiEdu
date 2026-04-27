import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Container,
  Avatar,
  Stack
} from '@mui/material';
import NavbarWithDrawer from '../../Components/NavDrawer';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { useSelector } from 'react-redux';
import { ArrowBack as ArrowBackIcon, PersonAdd as PersonAddIcon, Save as SaveIcon } from '@mui/icons-material';

export default function AddTeacher() {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/add-user`, {
        ...form,
        role: 'teacher'
      }, {
        headers: { 'x-auth-token': user.token }
      });

      Swal.fire({
        icon: 'success',
        title: 'Muvaffaqiyatli!',
        text: "O'qituvchi muvaffaqiyatli qo'shildi!",
        confirmButtonColor: '#f59e0b',
        background: '#1e293b',
        color: '#fff'
      }).then(() => {
        navigate('/teachers/list');
      });
    } catch (error) {
      console.error('Error adding teacher:', error);
      Swal.fire({
        icon: 'error',
        title: 'Xatolik',
        text: error.response?.data?.msg || "O'qituvchini qo'shishda xatolik yuz berdi!",
        background: '#1e293b',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.name.trim() && form.email.trim() && form.password.trim();

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="sm">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/teachers/list')}
              sx={{ 
                textTransform: 'none', 
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 'bold',
                '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
              }}
            >
              Orqaga qaytish
            </Button>
          </Box>

          <Paper
            className="glass-dark"
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
              <Avatar sx={{ 
                width: 64, 
                height: 64, 
                bgcolor: 'rgba(245, 158, 11, 0.1)', 
                color: '#f59e0b', 
                mb: 2,
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <PersonAddIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "900",
                  textAlign: "center",
                  color: "#fff",
                  textShadow: '0 0 20px rgba(245, 158, 11, 0.5)'
                }}
              >
                Yangi o'qituvchi qo'shish
              </Typography>
            </Box>

            <Stack spacing={4}>
              <TextField
                fullWidth
                label="Ism va Familiya"
                name="name"
                variant="outlined"
                value={form.name}
                onChange={handleChange}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#f59e0b' },
                }}
              />
              <TextField
                fullWidth
                label="Email manzili"
                name="email"
                type="email"
                variant="outlined"
                value={form.email}
                onChange={handleChange}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#f59e0b' },
                }}
              />
              <TextField
                fullWidth
                label="Boshlang'ich parol"
                name="password"
                type="password"
                variant="outlined"
                value={form.password}
                onChange={handleChange}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#f59e0b' },
                  '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.4)', mt: 1 }
                }}
                helperText="O'qituvchi ushbu parol orqali tizimga kiradi"
              />

              <Button
                variant="contained"
                fullWidth
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSubmit}
                disabled={!isFormValid || loading}
                sx={{
                  py: 2,
                  mt: 2,
                  fontSize: "1.1rem",
                  fontWeight: "900",
                  borderRadius: 4,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  boxShadow: '0 10px 20px rgba(217, 119, 6, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #d97706, #b45309)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(217, 119, 6, 0.4)',
                  },
                  '&:disabled': {
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Yaratish
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </NavbarWithDrawer>
  );
}
