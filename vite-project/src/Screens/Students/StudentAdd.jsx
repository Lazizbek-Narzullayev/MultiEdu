import { TextField, Button, Paper, Typography, Box, Container, CircularProgress, Avatar, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import NavbarWithDrawer from "../../Components/NavDrawer";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import { useSelector } from "react-redux";
import { ArrowBack as ArrowBackIcon, PersonAdd as PersonAddIcon, Save as SaveIcon } from "@mui/icons-material";

export default function AddStudent() {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const isFormValid = formData.name.trim() && formData.email.trim() && (id ? true : formData.password.trim());

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        Swal.fire({
          icon: "info",
          title: "Tez orada",
          text: "Foydalanuvchini tahrirlash funksiyasi tez orada qo'shiladi.",
          background: "#1e293b",
          color: "#fff"
        });
      } else {
        await axios.post(`${API_BASE_URL}/auth/add-user`, {
          ...formData,
          role: 'student'
        }, {
          headers: { 'x-auth-token': user.token }
        });

        Swal.fire({
          icon: "success",
          title: "Muvaffaqiyatli!",
          text: "Talaba muvaffaqiyatli yaratildi.",
          confirmButtonColor: "#3b82f6",
          background: "#1e293b",
          color: "#fff"
        });
        navigate("/students/list");
      }
    } catch (error) {
      console.error("Error saving student:", error);
      Swal.fire({
        icon: "error",
        title: "Xatolik",
        text: error.response?.data?.msg || "Talabani saqlashda xatolik yuz berdi.",
        background: "#1e293b",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="sm">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/students/list')}
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
                bgcolor: 'rgba(59, 130, 246, 0.1)', 
                color: '#3b82f6', 
                mb: 2,
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <PersonAddIcon fontSize="large" />
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
                {id ? "Talabani tahrirlash" : "Yangi talaba qo'shish"}
              </Typography>
            </Box>

            <Stack spacing={4}>
              <TextField
                label="To'liq ismi"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                label="Email manzili"
                fullWidth
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              {!id && (
                <TextField
                  label="Boshlang'ich parol"
                  fullWidth
                  type="password"
                  variant="outlined"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
                    '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.4)', mt: 1 }
                  }}
                  helperText="Talaba ushbu parol orqali tizimga kiradi"
                />
              )}

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
                {id ? "Yangilash" : "Yaratish"}
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </NavbarWithDrawer>
  );
}
