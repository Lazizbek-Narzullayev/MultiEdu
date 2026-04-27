import React, { useState, useEffect } from "react";
import { TextField, Button, Paper, Typography, Box, Container, Stack, Avatar } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import NavbarWithDrawer from "../../Components/NavDrawer";
import Swal from "sweetalert2";
import { LibraryBooks as LibraryIcon, Save as SaveIcon } from "@mui/icons-material";

export default function LibraryForm() {
  const [formData, setFormData] = useState({
    userName: "",
    bookName: "",
    charges: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch record if editing
  useEffect(() => {
    const fetchLibrary = async () => {
      if (id) {
        const docRef = doc(db, "library", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
      }
    };
    fetchLibrary();
  }, [id]);

  // Handle submit
  const handleSubmit = async () => {
    try {
      if (id) {
        await updateDoc(doc(db, "library", id), formData);
        Swal.fire({
          icon: "success",
          title: "Muvaffaqiyatli!",
          text: "Kutubxona yozuvi yangilandi.",
          confirmButtonColor: '#3b82f6'
        }).then(() => navigate("/library/list"));
      } else {
        await addDoc(collection(db, "library"), formData);
        Swal.fire({
          icon: "success",
          title: "Muvaffaqiyatli!",
          text: "Kutubxona yozuvi qo'shildi.",
          confirmButtonColor: '#3b82f6'
        }).then(() => navigate("/library/list"));
      }
    } catch (error) {
      console.error("Error saving library record:", error);
      Swal.fire({
        icon: "error",
        title: "Xatolik!",
        text: "Saqlashda xatolik yuz berdi!",
      });
    }
  };

  const isFormValid =
    formData.userName.trim() &&
    formData.bookName.trim() &&
    formData.charges.toString().trim();

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="sm">
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
                bgcolor: 'rgba(59, 130, 246, 0.1)', 
                color: '#3b82f6', 
                mb: 2,
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <LibraryIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "900",
                  textAlign: "center",
                  color: "#fff",
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                }}
              >
                {id ? "Yozuvni tahrirlash" : "Kutubxona yozuvi"}
              </Typography>
            </Box>

            <Stack spacing={4}>
              <TextField
                label="Foydalanuvchi ismi"
                fullWidth
                variant="outlined"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
                }}
              />

              <TextField
                label="Kitob nomi"
                fullWidth
                variant="outlined"
                value={formData.bookName}
                onChange={(e) =>
                  setFormData({ ...formData, bookName: e.target.value })
                }
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
                }}
              />

              <TextField
                label="To'lov miqdori"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.charges}
                onChange={(e) =>
                  setFormData({ ...formData, charges: e.target.value })
                }
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
                }}
              />

              <Button
                variant="contained"
                fullWidth
                startIcon={<SaveIcon />}
                disabled={!isFormValid}
                onClick={handleSubmit}
                sx={{
                  py: 2,
                  mt: 2,
                  fontSize: "1.1rem",
                  fontWeight: "900",
                  borderRadius: 4,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(37, 99, 235, 0.4)',
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
