import React, { useState, useEffect } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Container,
  Stack,
  Avatar,
  TableContainer,
  IconButton,
  Tooltip,
  Grid,
  CircularProgress
} from "@mui/material";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import NavbarWithDrawer from "../../Components/NavDrawer";
import { SwapHoriz as SwapIcon, Person as PersonIcon, Email as EmailIcon, Done as DoneIcon } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export default function TransferStudent() {
  const { t } = useTranslation();
  const [studentId, setStudentId] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch transferred students
  const fetchTransferredStudents = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "students"), where("status", "==", "transferred"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(data);
    } catch (error) {
      console.error("Error fetching transferred students:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransferredStudents();
  }, []);

  // Handle transfer action
  const handleTransfer = async () => {
    if (!studentId.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Diqqat!',
        text: 'Iltimos, talaba ID-sini kiriting',
      });
      return;
    }
    try {
      const studentRef = doc(db, "students", studentId);
      await updateDoc(studentRef, { status: "transferred" });
      Swal.fire({
        icon: 'success',
        title: 'Muvaffaqiyatli!',
        text: 'Talaba muvaffaqiyatli o\'tkazildi',
        confirmButtonColor: '#1976d2'
      });
      setStudentId("");
      fetchTransferredStudents();
    } catch (error) {
      console.error("Error transferring student:", error);
      Swal.fire({
        icon: 'error',
        title: 'Xatolik!',
        text: 'Talabani o\'tkazishda xatolik yuz berdi. ID-ni tekshiring.',
      });
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
                {t('student_transfer_title') || t('transfer', 'Talabalar ko\'chirish')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                Talabalarni bir guruhdan boshqasiga o'tkazish va statusini o'zgartirish
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  bgcolor: '#fff',
                  height: 'fit-content'
                }}
              >
                <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: '900', mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SwapIcon sx={{ color: '#1976d2' }} /> {t('transfer_form_title') || 'O\'tkazish shakli'}
                </Typography>
                
                <Stack spacing={4}>
                  <TextField
                    label="Talaba ID-si"
                    fullWidth
                    variant="outlined"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Masalan: std-123456"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleTransfer}
                    startIcon={<SwapIcon />}
                    sx={{
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      borderRadius: 2,
                      textTransform: 'none',
                      bgcolor: '#1976d2',
                      '&:hover': {
                        bgcolor: '#1565c0',
                        transform: 'translateY(-1px)',
                      },
                      transition: '0.3s'
                    }}
                  >
                    {t('transfer_btn') || 'O\'tkazish'}
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* List Area */}
            <Grid item xs={12} md={7}>
              <TableContainer
                component={Paper}
                elevation={2}
                sx={{
                  p: 0,
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  bgcolor: '#fff'
                }}
              >
                <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: '900' }}>
                    {t('transferred_list_title') || 'O\'tkazilganlar'}
                  </Typography>
                  <Tooltip title="Ma'lumotlarni yangilash">
                    <IconButton sx={{ color: '#64748b', '&:hover': { color: '#1976d2', bgcolor: 'rgba(25, 118, 210, 0.05)' } }} onClick={fetchTransferredStudents}>
                      <DoneIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>Talaba</TableCell>
                      <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>Email</TableCell>
                      <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }} align="right">Maqomi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 6, border: 'none' }}>
                          <CircularProgress size={30} sx={{ color: '#1976d2' }} />
                        </TableCell>
                      </TableRow>
                    ) : students.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 10, border: 'none' }}>
                          <Typography sx={{ color: '#cbd5e1', fontWeight: 'bold' }}>
                            {t('no_transferred_found') || 'O\'tkazilgan talabalar yo\'q'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.map((student) => (
                        <TableRow key={student.id} sx={{ '&:hover': { bgcolor: '#f8fafc' }, transition: '0.3s' }}>
                          <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2', width: 32, height: 32, fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {student.name?.charAt(0)}
                              </Avatar>
                              <Typography sx={{ color: '#1e293b', fontWeight: 'bold' }}>{student.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#475569', borderBottom: '1px solid #f1f5f9' }}>{student.email}</TableCell>
                          <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                            <Box sx={{ 
                              display: 'inline-flex', 
                              px: 1.5, 
                              py: 0.5, 
                              bgcolor: 'rgba(25, 118, 210, 0.1)', 
                              color: '#1976d2', 
                              borderRadius: 1.5,
                              fontWeight: '900',
                              fontSize: '0.7rem',
                              textTransform: 'uppercase',
                              border: '1px solid rgba(25, 118, 210, 0.2)'
                            }}>
                              {student.status}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </NavbarWithDrawer>
  );
}
