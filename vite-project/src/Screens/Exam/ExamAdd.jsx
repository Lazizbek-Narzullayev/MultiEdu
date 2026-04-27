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
  CircularProgress,
  Divider
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import NavbarWithDrawer from "../../Components/NavDrawer";
import Swal from "sweetalert2";
import { 
  Assignment as AssignmentIcon, 
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Badge as BadgeIcon,
  Person as PersonIcon,
  Class as ClassIcon,
  MenuBook as SubjectIcon,
  EmojiEvents as GradeIcon,
  Calculate as MarksIcon
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function ExamAdd() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    rollNumber: "",
    studentName: "",
    className: "",
    subject: "",
    marksObtained: "",
    totalMarks: "",
    grade: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch existing exam if editing
  useEffect(() => {
    const fetchExam = async () => {
      if (id) {
        setLoading(true);
        try {
          const docRef = doc(db, "exams", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching exam:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchExam();
  }, [id]);

  // Handle Submit
  const handleSubmit = async () => {
    if (Object.values(formData).some((value) => String(value).trim() === "")) {
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
        await updateDoc(doc(db, "exams", id), formData);
        Swal.fire({
          icon: "success",
          title: "Yangilandi!",
          text: "Imtihon natijasi muvaffaqiyatli yangilandi!",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: '#06b6d4'
        }).then(() => navigate("/exam/resultlist"));
      } else {
        await addDoc(collection(db, "exams"), formData);
        Swal.fire({
          icon: "success",
          title: "Qo'shildi!",
          text: "Yangi imtihon natijasi muvaffaqiyatli saqlandi!",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: '#06b6d4'
        }).then(() => navigate("/exam/resultlist"));
      }
    } catch (error) {
      console.error("Error saving exam:", error);
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

  // Button disable check
  const isFormValid = !loading && Object.values(formData).every((value) => String(value).trim() !== "");

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="sm">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/exam/resultlist')}
              sx={{ 
                textTransform: 'none', 
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 'bold',
                '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
              }}
            >
              Natijalar ro'yxatiga qaytish
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
                bgcolor: 'rgba(6, 182, 212, 0.1)', 
                color: '#06b6d4', 
                mb: 2,
                border: '1px solid rgba(6, 182, 212, 0.2)'
              }}>
                <AssignmentIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "900",
                  textAlign: "center",
                  color: "#fff",
                  textShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
                }}
              >
                {id ? "Natijani tahrirlash" : "Imtihon natijasi"}
              </Typography>
            </Box>

            <Stack spacing={4}>
              <TextField
                label="Roll raqami"
                fullWidth
                variant="outlined"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#06b6d4' },
                }}
              />
              <TextField
                label="O'quvchi ismi"
                fullWidth
                variant="outlined"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#06b6d4' },
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
                    '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#06b6d4' },
                }}
              />
              <TextField
                label="Fan"
                fullWidth
                variant="outlined"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#06b6d4' },
                }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="To'plangan ball"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.marksObtained}
                  onChange={(e) => setFormData({ ...formData, marksObtained: e.target.value })}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#06b6d4' },
                  }}
                />
                <TextField
                  label="Umumiy ball"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#06b6d4' },
                  }}
                />
              </Box>
              <TextField
                label="Bahosi (Grade)"
                fullWidth
                variant="outlined"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#06b6d4' },
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
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  boxShadow: '0 10px 20px rgba(6, 182, 212, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0891b2, #0e7490)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(6, 182, 212, 0.4)',
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
