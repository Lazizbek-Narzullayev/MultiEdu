import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Container,
  IconButton,
  Avatar,
  Tooltip,
  Stack,
  CircularProgress
} from "@mui/material";
import { Delete, Add as AddIcon, Person, Email, Phone, AccountCircle, School as SchoolIcon } from "@mui/icons-material";
import NavbarWithDrawer from "../../Components/NavDrawer";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../config/apiConfig";
import { useTranslation } from "react-i18next";

export default function TeacherList() {
  const { t, i18n } = useTranslation();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/role/teacher`, {
        headers: { "x-auth-token": user.token }
      });
      setTeachers(res.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      Swal.fire(t("error"), t("loading_error"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchTeachers();
    }
  }, [user]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("delete_user_confirm"),
      text: t("delete_student_warning"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#f59e0b",
      confirmButtonText: t("yes_delete"),
      cancelButtonText: t("cancel"),
      background: "#1e293b",
      color: "#fff"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/auth/user/${id}`, {
          headers: { "x-auth-token": user.token }
        });
        setTeachers((prev) => prev.filter((t) => t._id !== id));
        Swal.fire(t("success"), t("user_deleted"), "success");
      } catch (error) {
        console.error("Error deleting teacher:", error);
        Swal.fire(t("error"), t("user_delete_error"), "error");
      }
    }
  };

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 6,
              p: 4,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              bgcolor: '#fff'
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ color: "#1e293b", fontWeight: "900" }}>
                {t('teacher_list_title') || t('teachers', 'O\'qituvchilar')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                Tizimdagi barcha o'qituvchilar va ularning ma'lumotlarini boshqarish
              </Typography>
            </Box>
            {(user?.role === "admin" || user?.role === "super-admin") && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: "#1976d2",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#1565c0" },
                  transition: "0.3s"
                }}
                onClick={() => navigate("/teachers/add")}
              >
                {t('add_teacher_btn') || t('add_new', 'Yangi qo\'shish')}
              </Button>
            )}
          </Box>

          {/* Table Area */}
          <TableContainer
            component={Paper}
            className="glass-dark"
            sx={{
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden'
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 15 }}>
                <CircularProgress sx={{ color: "#f59e0b" }} />
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>O'qituvchi</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Email manzili</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Ro'yxatdan o'tgan sana</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: '1px solid rgba(255,255,255,0.1)' }} align="right">Amallar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <TableRow 
                        key={teacher._id}
                        sx={{ 
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                          transition: '0.3s'
                        }}
                      >
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontWeight: 'bold' }}>
                              {teacher.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>{teacher.name}</Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>#{teacher._id.substring(0, 8)}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          {teacher.email}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {new Date(teacher.date).toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language === 'ru' ? 'ru-RU' : 'uz-UZ')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          {user?.role === "super-admin" && (
                            <Tooltip title="O'chirish">
                              <IconButton 
                                onClick={() => handleDelete(teacher._id)}
                                sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' } }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 10, border: 'none' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }}>
                          {t('no_teachers_found') || 'Hech qanday o\'qituvchi topilmadi'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Container>
      </Box>
    </NavbarWithDrawer>
  );
}
