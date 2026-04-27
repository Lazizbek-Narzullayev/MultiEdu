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
  Class as ClassIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Timeline as TimelineIcon,
  Wc as GenderIcon
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function ClassForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    prevGrade: "",
    phone: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchClassRecord = async () => {
      if (id) {
        setLoading(true);
        try {
          const docRef = doc(db, "classes", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching class record:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchClassRecord();
  }, [id]);

  const handleSubmit = async () => {
    if (Object.values(formData).some(val => val.trim() === "")) {
        Swal.fire({
          icon: "warning",
          title: "Diqqat!",
          text: "Iltimos, barcha maydonlarni to'ldiring",
        });
        return;
    }

    setLoading(true);
    try {
      if (id) {
        await updateDoc(doc(db, "classes", id), formData);
        Swal.fire({
          icon: "success",
          title: "Yangilandi!",
          text: "Sinf yozuvi muvaffaqiyatli yangilandi",
          confirmButtonColor: "#2563eb",
        }).then(() => navigate("/class/list"));
      } else {
        await addDoc(collection(db, "classes"), formData);
        Swal.fire({
          icon: "success",
          title: "Yaratildi!",
          text: "Yangi sinf yozuvi muvaffaqiyatli saqlandi",
          confirmButtonColor: "#2563eb",
        }).then(() => navigate("/class/list"));
      }
    } catch (error) {
      console.error("Error saving record:", error);
      Swal.fire({
        icon: "error",
        title: "Xatolik!",
        text: "Ma'lumotlarni saqlashda xatolik yuz berdi",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Object.values(formData).every((val) => val.trim() !== "") && !loading;

  return (
    <NavbarWithDrawer>
      <Box className="mesh-bg-light" sx={{ minHeight: '100%', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="sm">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/class/list')}
              sx={{ 
                textTransform: 'none', 
                color: '#475569',
                fontWeight: 'bold',
                '&:hover': { color: '#0f172a', bgcolor: '#f1f5f9' }
              }}
            >
              Ro'yxatga qaytish
            </Button>
          </Box>

          <Paper
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 1,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
              <Avatar variant="rounded" sx={{ 
                width: 64, 
                height: 64, 
                border: '1px solid rgba(37, 99, 235, 0.2)',
                borderRadius: 1
              }}>
                <ClassIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "900",
                  textAlign: "center",
                  color: "#0f172a",
                }}
              >
                {id ? "Yozuvni tahrirlash" : "Yangi sinf yozuvi"}
              </Typography>
            </Box>

            <Stack spacing={4}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Ism"
                  fullWidth
                  variant="outlined"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      color: '#1e293b',
                      '& fieldset': { borderColor: '#e2e8f0', borderRadius: 1 },
                      '&:hover fieldset': { borderColor: '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748b' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
                  }}
                />
                <TextField
                  label="Familiya"
                  fullWidth
                  variant="outlined"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      color: '#1e293b',
                      '& fieldset': { borderColor: '#e2e8f0', borderRadius: 1 },
                      '&:hover fieldset': { borderColor: '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748b' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
                  }}
                />
              </Box>

              <TextField
                label="Tug'ilgan sana"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                variant="outlined"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      color: '#1e293b',
                      '& fieldset': { borderColor: '#e2e8f0', borderRadius: 1 },
                      '&:hover fieldset': { borderColor: '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748b' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
                  }}
              />

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, fontWeight: "900", color: "#2563eb", display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <GenderIcon fontSize="small" /> Jinsi
                </Typography>
                <RadioGroup
                  row
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  sx={{ gap: 4 }}
                >
                  <FormControlLabel 
                    value="Male" 
                    control={<Radio sx={{ color: '#e2e8f0', '&.Mui-checked': { color: '#2563eb' } }} />} 
                    label={<Typography sx={{ color: '#475569', fontWeight: 800 }}>Erkak</Typography>} 
                  />
                  <FormControlLabel 
                    value="Female" 
                    control={<Radio sx={{ color: '#e2e8f0', '&.Mui-checked': { color: '#2563eb' } }} />} 
                    label={<Typography sx={{ color: '#475569', fontWeight: 800 }}>Ayol</Typography>} 
                  />
                </RadioGroup>
              </Box>

              <Button
                variant="contained"
                fullWidth
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSubmit}
                disabled={!isFormValid} 
                sx={{
                  py: 2,
                  mt: 2,
                  fontSize: "1.1rem",
                  fontWeight: "900",
                  borderRadius: 1,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 24px rgba(37, 99, 235, 0.35)',
                  },
                  '&:disabled': {
                    background: '#f1f5f9',
                    color: '#94a3b8'
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
