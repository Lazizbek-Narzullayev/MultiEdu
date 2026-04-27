import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box, Container, Stack, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import NavbarWithDrawer from "../../Components/NavDrawer";
import Swal from "sweetalert2";
import { Paid as PaidIcon, Save as SaveIcon } from "@mui/icons-material";

export default function FeeSubmissionAdd() {
  const [formData, setFormData] = useState({
    studentName: "",
    className: "",
    amount: "",
    date: "",
  });

  const navigate = useNavigate();

  // Handle submit
  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "feeSubmissions"), formData);
      Swal.fire({
        icon: "success",
        title: "Muvaffaqiyatli!",
        text: "To'lov muvaffaqiyatli qabul qilindi!",
        confirmButtonColor: '#3b82f6'
      });
      navigate("/fees/Sublist");
    } catch (error) {
      console.error("Error submitting fee:", error);
      Swal.fire({
        icon: "error",
        title: "Xatolik!",
        text: "Tizimda xatolik yuz berdi. Iltimos qaytadan urining.",
      });
    }
  };

  // Check if all fields are filled
  const isFormValid =
    formData.studentName &&
    formData.className &&
    formData.amount &&
    formData.date;

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="sm">
          <Paper
            elevation={1}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              bgcolor: '#fff'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
              <Avatar sx={{ 
                width: 64, 
                height: 64, 
                bgcolor: '#eff6ff', 
                color: '#1976d2', 
                mb: 2,
                border: '1px solid #dbeafe'
              }}>
                <PaidIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "900",
                  textAlign: "center",
                  color: "#1e293b"
                }}
              >
                To'lovni qabul qilish
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
                    borderRadius: 2,
                    '& fieldset': { borderColor: '#e2e8f0' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                  },
                  '& .MuiInputLabel-root': { color: '#64748b' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
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
                    borderRadius: 2,
                    '& fieldset': { borderColor: '#e2e8f0' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                  },
                  '& .MuiInputLabel-root': { color: '#64748b' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
                }}
              />
              <TextField
                label="Miqdor"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': { borderColor: '#e2e8f0' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                  },
                  '& .MuiInputLabel-root': { color: '#64748b' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
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
                    borderRadius: 2,
                    '& fieldset': { borderColor: '#e2e8f0' },
                    '&:hover fieldset': { borderColor: '#cbd5e1' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                  },
                  '& .MuiInputLabel-root': { color: '#64748b' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
                }}
              />

              <Button
                variant="contained"
                fullWidth
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={!isFormValid}
                sx={{
                  py: 2,
                  mt: 2,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  textTransform: 'none',
                  bgcolor: '#1976d2',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#1565c0',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                  }
                }}
              >
                Yuborish
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </NavbarWithDrawer>
  );
}
