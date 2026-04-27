import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Container,
  Avatar,
  Stack,
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
  MenuBook as SubjectIcon,
  Layers as LayersIcon
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function SubjectAdd() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    subjectName: "",
    className: "",
    group: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchSubject = async () => {
      if (id) {
        setLoading(true);
        try {
          const docRef = doc(db, "subjects", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching subject:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSubject();
  }, [id]);

  const handleSubmit = async () => {
    if (!formData.subjectName || !formData.className || !formData.group) {
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
        await updateDoc(doc(db, "subjects", id), formData);
        Swal.fire({
            icon: "success",
            title: "Yangilandi!",
            text: "Fan muvaffaqiyatli yangilandi",
            background: "#1e293b",
            color: "#fff",
            confirmButtonColor: "#8b5cf6",
          }).then(() => navigate("/subjects/list"));
      } else {
        await addDoc(collection(db, "subjects"), formData);
        Swal.fire({
            icon: "success",
            title: "Yaratildi!",
            text: "Yangi fan muvaffaqiyatli saqlandi",
            background: "#1e293b",
            color: "#fff",
            confirmButtonColor: "#8b5cf6",
          }).then(() => navigate("/subjects/list"));
      }
    } catch (error) {
      console.error("Error saving subject:", error);
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
    formData.subjectName.trim() !== "" &&
    formData.className.trim() !== "" &&
    formData.group.trim() !== "";

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="sm">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/subjects/list')}
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
                bgcolor: 'rgba(139, 92, 246, 0.1)', 
                color: '#8b5cf6', 
                mb: 2,
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <SubjectIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "900",
                  textAlign: "center",
                  color: "#fff",
                  textShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
                }}
              >
                {id ? "Fanni tahrirlash" : "Yangi fan qo'shish"}
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
                    '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#8b5cf6' },
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
                    '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#8b5cf6' },
                }}
              />

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, fontWeight: "900", color: "#8b5cf6", display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <LayersIcon fontSize="small" /> Guruhni tanlang
                </Typography>
                <RadioGroup
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  sx={{ gap: 1 }}
                >
                  <FormControlLabel
                    value="GeneralScience"
                    control={<Radio sx={{ color: 'rgba(255,255,255,0.1)', '&.Mui-checked': { color: '#8b5cf6' } }} />}
                    label={<Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 800 }}>General Science</Typography>}
                  />
                  <FormControlLabel
                    value="PreEngineering"
                    control={<Radio sx={{ color: 'rgba(255,255,255,0.1)', '&.Mui-checked': { color: '#8b5cf6' } }} />}
                    label={<Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 800 }}>Pre-Engineering</Typography>}
                  />
                </RadioGroup>
              </Box>

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
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  boxShadow: '0 10px 20px rgba(124, 58, 237, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(124, 58, 237, 0.4)',
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
