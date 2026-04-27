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
  ArrowBack as ArrowBackIcon, 
  Save as SaveIcon, 
  AssignmentInd as AssignmentIcon,
  Class as ClassIcon,
  Book as SubjectIcon
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function AddTeacherAllocation() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    teacherName: "",
    subject: "",
    className: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const docRef = doc(db, "teacherAllocations", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching allocation:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!formData.teacherName || !formData.subject || !formData.className) {
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
        await updateDoc(doc(db, "teacherAllocations", id), formData);
        Swal.fire({
          icon: "success",
          title: "Yangilandi!",
          text: "Biriktiruv muvaffaqiyatli yangilandi",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#f59e0b",
        }).then(() => navigate("/teachers/alloctlist"));
      } else {
        await addDoc(collection(db, "teacherAllocations"), formData);
        Swal.fire({
          icon: "success",
          title: "Yaratildi!",
          text: "Yangi biriktiruv muvaffaqiyatli saqlandi",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#f59e0b",
        }).then(() => navigate("/teachers/alloctlist"));
      }
    } catch (error) {
      console.error("Error saving allocation:", error);
      Swal.fire({
        icon: "error",
        title: "Xatolik!",
        text: "Ma'lumotlarni saqlashda xatolik yuz berdi",
        background: "#1e293b",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.teacherName.trim() &&
    formData.subject.trim() &&
    formData.className.trim();

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="sm">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/teachers/alloctlist')}
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
                bgcolor: 'rgba(245, 158, 11, 0.1)', 
                color: '#f59e0b', 
                mb: 2,
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <AssignmentIcon fontSize="large" />
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
                {id ? "Biriktiruvni tahrirlash" : "Yangi biriktiruv qo'shish"}
              </Typography>
            </Box>

            <Stack spacing={4}>
              <TextField
                label="O'qituvchi ismi"
                fullWidth
                variant="outlined"
                value={formData.teacherName}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
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
                label="Fan nomi"
                fullWidth
                variant="outlined"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
                label="Sinf / Guruh"
                fullWidth
                variant="outlined"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
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
                {id ? "Yangilash" : "Saqlash"}
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </NavbarWithDrawer>
  );
}
