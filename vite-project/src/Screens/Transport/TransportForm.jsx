import React, { useState, useEffect } from "react";
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Box, 
  Container, 
  Stack, 
  Avatar, 
  IconButton,
  CircularProgress
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import NavbarWithDrawer from "../../Components/NavDrawer";
import Swal from "sweetalert2";
import { 
  LocalShipping as TransportIcon, 
  Save as SaveIcon, 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Route as RouteIcon,
  Payments as PaymentsIcon,
  CalendarToday as CalendarIcon
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function TransportForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    studentName: "",
    routeVehicle: "",
    charges: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch transport entry if editing
  useEffect(() => {
    const fetchTransport = async () => {
      if (id) {
        setLoading(true);
        try {
          const docRef = doc(db, "transport", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching transport:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTransport();
  }, [id]);

  // Handle submit
  const handleSubmit = async () => {
    if (!formData.studentName || !formData.routeVehicle || !formData.charges || !formData.date) {
      Swal.fire({
        icon: "warning",
        title: "Diqqat!",
        text: "Iltimos, barcha maydonlarni to'ldiring",
        background: "#1e293b",
        color: "#fff"
      });
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await updateDoc(doc(db, "transport", id), formData);
        Swal.fire({
          icon: "success",
          title: "Yangilandi!",
          text: "Transport ma'lumotlari muvaffaqiyatli yangilandi!",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: '#10b981'
        }).then(() => navigate("/transport/list"));
      } else {
        await addDoc(collection(db, "transport"), formData);
        Swal.fire({
          icon: "success",
          title: "Ro'yxatga olindi!",
          text: "Yangi transport yozuvi muvaffaqiyatli saqlandi!",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: '#10b981'
        }).then(() => navigate("/transport/list"));
      }
    } catch (error) {
      console.error("Error saving transport entry:", error);
      Swal.fire({
        icon: "error",
        title: "Xatolik!",
        text: "Ma'lumotlarni saqlashda xatolik yuz berdi!",
        background: "#1e293b",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !formData.studentName || !formData.routeVehicle || !formData.charges || !formData.date || loading;

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="sm">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/transport/list')}
              sx={{ 
                textTransform: 'none', 
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 'bold',
                '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
              }}
            >
              Ro'yxatga qaytish
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
                bgcolor: 'rgba(16, 185, 129, 0.1)', 
                color: '#10b981', 
                mb: 2,
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <TransportIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "900",
                  textAlign: "center",
                  color: "#fff",
                  textShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
                }}
              >
                {id ? "Transportni tahrirlash" : "Transportni ro'yxatga olish"}
              </Typography>
            </Box>

            <Stack spacing={4}>
              <TextField
                label="Talaba ismi"
                fullWidth
                variant="outlined"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
                }}
              />
              <TextField
                label="Yo'nalish / Transport"
                fullWidth
                variant="outlined"
                value={formData.routeVehicle}
                onChange={(e) => setFormData({ ...formData, routeVehicle: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
                }}
              />
              <TextField
                label="To'lov miqdori"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.charges}
                onChange={(e) => setFormData({ ...formData, charges: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
                }}
              />
              <TextField
                label="Sana"
                type="date"
                fullWidth
                variant="outlined"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
                  '& .MuiInputBase-input': { color: '#fff' }
                }}
              />

              <Button
                variant="contained"
                fullWidth
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSubmit}
                disabled={isDisabled}
                sx={{
                  py: 2,
                  mt: 2,
                  fontSize: "1.1rem",
                  fontWeight: "900",
                  borderRadius: 4,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669, #047857)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(16, 185, 129, 0.4)',
                  },
                  '&:disabled': {
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {id ? "Yangilash" : "Saqlash"}
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </NavbarWithDrawer>
  );
}
