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
import { Delete, Add as AddIcon, Person, Email, Phone, AccountCircle, Group as GroupIcon } from "@mui/icons-material";
import NavbarWithDrawer from "../../Components/NavDrawer";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../config/apiConfig";
import { useTranslation } from "react-i18next";

export default function StudentList() {
  const { t, i18n } = useTranslation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/role/student`, {
        headers: { "x-auth-token": user.token }
      });
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      Swal.fire(t("error"), t("loading_error"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      if (user.role !== "super-admin" && user.role !== "admin") {
        Swal.fire(t("access_denied"), t("only_admin_can_view"), "warning");
        navigate("/dashboard");
        return;
      }
      fetchStudents();
    }
  }, [user]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("delete_student_confirm"),
      text: t("delete_student_warning"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3b82f6",
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
        setStudents((prev) => prev.filter((s) => s._id !== id));
        Swal.fire(t("success"), t("student_deleted_msg"), "success");
      } catch (error) {
        console.error("Error deleting student:", error);
        Swal.fire(t("error"), t("user_delete_error"), "error");
      }
    }
  };

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="xl">
          <Box
            className="glass-dark"
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
                {t('student_list_title') || t('students', 'Talabalar')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                Tizimdagi barcha talabalar va ularning ma'lumotlarini boshqarish
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
                  "&:hover": {
                    bgcolor: "#1565c0",
                  },
                  transition: "0.3s"
                }}
                onClick={() => navigate("/students/add")}
              >
                {t('add_student_btn') || t('add_student', 'Talaba qo\'shish')}
              </Button>
            )}
          </Box>

          <TableContainer
            component={Paper}
            elevation={2}
            sx={{
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              bgcolor: '#fff'
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 15 }}>
                <CircularProgress sx={{ color: "#3b82f6" }} />
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>Talaba</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>Email manzili</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>Ro'yxatdan o'tgan sana</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }} align="right">Amallar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <TableRow 
                        key={student._id}
                        sx={{ 
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                          transition: '0.3s'
                        }}
                      >
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 'bold' }}>
                              {student.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ color: '#1e293b', fontWeight: 'bold' }}>{student.name}</Typography>
                              <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>#{student._id.substring(0, 8)}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: '#475569', fontWeight: 'bold', borderBottom: '1px solid #f1f5f9' }}>
                          {student.email}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                          <Typography sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {new Date(student.date).toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language === 'ru' ? 'ru-RU' : 'uz-UZ')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                          {(user?.role === "admin" || user?.role === "super-admin") && (
                            <Tooltip title="O'chirish">
                              <IconButton 
                                onClick={() => handleDelete(student._id)}
                                sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
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
                        <Typography sx={{ color: '#cbd5e1', fontWeight: 'bold' }}>
                          {t('no_students_found') || 'Hech qanday talaba topilmadi'}
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
