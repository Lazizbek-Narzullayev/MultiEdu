import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
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
  CircularProgress,
  Stack
} from "@mui/material";
import { 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Numbers as NumbersIcon, 
  Person as PersonIcon, 
  Class as ClassIcon, 
  MenuBook as SubjectIcon, 
  Grade as GradeIcon,
  Assignment as ExamIcon,
  Timeline as ResultsIcon
} from "@mui/icons-material";
import NavbarWithDrawer from "../../Components/NavDrawer";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

export default function ExamList() {
  const { t } = useTranslation();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch exams
  const fetchExams = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "exams"));
      setExams(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Delete exam
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'O\'chirishni tasdiqlaysizmi?',
      text: "Ushbu natijani qayta tiklab bo'lmaydi!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#06b6d4',
      confirmButtonText: 'Ha, o\'chirish',
      cancelButtonText: 'Bekor qilish',
      background: '#1e293b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "exams", id));
        setExams((prev) => prev.filter((e) => e.id !== id));
        Swal.fire({
          title: 'O\'chirildi!',
          icon: 'success',
          background: '#1e293b',
          color: '#fff'
        });
      } catch (error) {
        Swal.fire({
          title: 'Xatolik!',
          text: 'O\'chirishda xatolik yuz berdi.',
          icon: 'error',
          background: '#1e293b',
          color: '#fff'
        });
      }
    }
  };

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="xl">
          {/* Header */}
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
                {t('exam_result_title') || t('results', 'Imtihon natijalari')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                Talabalarning imtihon va test sinovlaridan olgan natijalari tahlili
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: "#06b6d4",
                color: "#fff",
                fontWeight: "900",
                borderRadius: 4,
                px: 4,
                py: 1.5,
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #0891b2, #0e7490)",
                  transform: "translateY(-2px)",
                  boxShadow: '0 10px 20px rgba(6, 182, 212, 0.3)'
                },
                transition: "all 0.3s"
              }}
              onClick={() => navigate("/exams/add")}
            >
              {t('add_result_btn') || t('add_new', 'Yangi qo\'shish')}
            </Button>
          </Box>

          {/* Table Area */}
          <TableContainer
            component={Paper}
            className="glass-dark"
            sx={{
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
              p: 0
            }}
          >
            <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Avatar sx={{ bgcolor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', width: 44, height: 44 }}>
                    <ResultsIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff' }}>
                    Akademik natijalar
                </Typography>
            </Box>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: 'none', py: 3 }}>Roll Raqami</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: 'none' }}>Talaba</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: 'none' }}>Sinf</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: 'none' }}>Fan</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: 'none' }} align="center">To'plangan ball</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: 'none' }} align="center">Baho</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: 'none' }} align="right">Amallar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 10, border: 'none' }}>
                            <CircularProgress sx={{ color: '#06b6d4' }} />
                        </TableCell>
                    </TableRow>
                ) : exams.length > 0 ? (
                  exams.map((e) => (
                    <TableRow 
                      key={e.id}
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                        transition: '0.3s'
                      }}
                    >
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', py: 3 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontWeight: 900 }}>
                          #{e.rollNumber}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', fontWeight: 900, fontSize: '0.85rem', width: 36, height: 36, border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                            {e.studentName?.charAt(0)}
                          </Avatar>
                          <Typography sx={{ color: '#fff', fontWeight: 800 }}>{e.studentName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{e.className}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography sx={{ color: '#06b6d4', fontWeight: 900 }}>{e.subject}</Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Box sx={{ 
                            display: 'inline-flex', 
                            px: 1.5, 
                            py: 0.5, 
                            bgcolor: 'rgba(255,255,255,0.05)', 
                            color: '#fff', 
                            borderRadius: 2,
                            fontWeight: 900,
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {e.marksObtained} / {e.totalMarks}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography sx={{ 
                            color: e.grade === 'A' || e.grade === '5' ? '#10b981' : '#f59e0b', 
                            fontWeight: 900,
                            fontSize: '1.1rem',
                            textShadow: `0 0 10px ${e.grade === 'A' || e.grade === '5' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                        }}>
                          {e.grade}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Tooltip title="O'chirish">
                          <IconButton 
                            onClick={() => handleDelete(e.id)}
                            sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)', '&:hover': { bgcolor: '#ef4444', color: '#fff' }, transition: '0.3s' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 15, border: 'none' }}>
                      <Box sx={{ opacity: 0.2 }}>
                        <ExamIcon sx={{ fontSize: 60, mb: 2, color: 'rgba(255,255,255,0.3)' }} />
                        <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem' }}>
                          Hech qanday natija topilmadi
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </NavbarWithDrawer>
  );
}
