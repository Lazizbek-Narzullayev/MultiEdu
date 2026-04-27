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
  LibraryBooks as SyllabusIcon,
  MenuBook as SubjectIcon,
  Class as ClassIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function SyllabusAdd() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    subjectName: "",
    className: "",
    description: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch syllabus if editing
  useEffect(() => {
    const fetchSyllabus = async () => {
      if (id) {
        setLoading(true);
        try {
          const docRef = doc(db, "syllabus", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching syllabus:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSyllabus();
  }, [id]);

  // Handle submit
  const handleSubmit = async () => {
    if (Object.values(formData).some(val => !val.trim())) {
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
        await updateDoc(doc(db, "syllabus", id), formData);
        Swal.fire({
          icon: "success",
          title: "Yangilandi!",
          text: "O'quv dasturi muvaffaqiyatli yangilandi!",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: '#84cc16'
        }).then(() => navigate("/syllabus/list"));
      } else {
        await addDoc(collection(db, "syllabus"), formData);
        Swal.fire({
          icon: "success",
          title: "Qo'shildi!",
          text: "Yangi o'quv dasturi muvaffaqiyatli saqlandi!",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: '#84cc16'
        }).then(() => navigate("/syllabus/list"));
      }
    } catch (error) {
      console.error("Error saving syllabus:", error);
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

  const isFormValid = !loading && Object.values(formData).every(val => val.trim());

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="sm">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/syllabus/list')}
              sx={{ 
                textTransform: 'none', 
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 'bold',
                '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
              }}
            >
              Dasturlar ro'yxatiga qaytish
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
                bgcolor: 'rgba(132, 204, 22, 0.1)', 
                color: '#84cc16', 
                mb: 2,
                border: '1px solid rgba(132, 204, 22, 0.2)'
              }}>
                <SyllabusIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "900",
                  textAlign: "center",
                  color: "#fff",
                  textShadow: '0 0 20px rgba(132, 204, 22, 0.5)'
                }}
              >
                {id ? "Dasturni tahrirlash" : "O'quv dasturi"}
              </Typography>
            </Box>

            <Stack spacing={4}>
              <TextField
                label="Fan nomi"
                fullWidth
                variant="outlined"
                value={formData.subjectName}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#84cc16' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#84cc16' },
                }}
              />
              <TextField
                label="Sinf"
                fullWidth
                variant="outlined"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#84cc16' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#84cc16' },
                }}
              />
              <TextField
                label="Tavsif"
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#84cc16' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#84cc16' },
                }}
              />
              <TextField
                label="Davomiyligi (masalan: 6 hafta)"
                fullWidth
                variant="outlined"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#84cc16' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#84cc16' },
                }}
              />

              <Button
                variant="contained"
                fullWidth
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={!isFormValid}
                onClick={handleSubmit}
                sx={{
                  py: 2,
                  mt: 2,
                  fontSize: "1.1rem",
                  fontWeight: "900",
                  borderRadius: 4,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #84cc16, #65a30d)',
                  boxShadow: '0 10px 20px rgba(132, 204, 22, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #65a30d, #4d7c0f)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(132, 204, 22, 0.4)',
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
