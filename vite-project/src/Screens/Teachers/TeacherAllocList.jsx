import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
  CircularProgress
} from "@mui/material";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import NavbarWithDrawer from "../../Components/NavDrawer";
import { Assignment as AssignmentIcon, Delete as DeleteIcon, Add as AddIcon, School as SchoolIcon, Class as ClassIcon, Person as TeacherIcon } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export default function TeacherAllocationList() {
  const { t } = useTranslation();
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "teacherAllocations"));
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setAllocations(list);
    } catch (error) {
      console.error("Error fetching allocations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t('delete_confirm_title') || 'O\'chirishni tasdiqlaysizmi?',
      text: t('delete_confirm_text') || 'Ushbu biriktiruvni qayta tiklab bo\'lmaydi!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#f59e0b',
      confirmButtonText: t('yes_delete') || 'Ha, o\'chirish',
      cancelButtonText: t('cancel') || 'Bekor qilish',
      background: '#1e293b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "teacherAllocations", id));
        fetchAllocations();
        Swal.fire({
          icon: 'success',
          title: 'O\'chirildi!',
          background: '#1e293b',
          color: '#fff'
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Xatolik!',
          text: 'O\'chirishda xatolik yuz berdi.',
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
                {t('teacher_allocation_title') || t('allocations', 'O\'qituvchilar taqsimoti')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                O'qituvchilarni sinf va fanlarga biriktirish boshqaruvi
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: "#1976d2",
                color: "#fff",
                borderRadius: 4,
                px: 4,
                py: 1.5,
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                  transform: "translateY(-2px)",
                  boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)'
                },
                transition: "all 0.3s"
              }}
              onClick={() => navigate("/teachers/alloc/add")}
            >
              {t('add_allocation_btn') || t('add_new', 'Yangi qo\'shish')}
            </Button>
          </Box>

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
                    <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>ID / Ma'lumot</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Ustoz</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Fan</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Sinf/Guruh</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: '1px solid rgba(255,255,255,0.1)' }} align="right">Amallar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allocations.length > 0 ? (
                    allocations.map((allocation) => (
                      <TableRow 
                        key={allocation.id}
                        sx={{ 
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                          transition: '0.3s'
                        }}
                      >
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontWeight: 'bold' }}>
                            #{allocation.id.substring(0, 8)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: 32, height: 32 }}>
                              <TeacherIcon fontSize="small" />
                            </Avatar>
                            <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>{allocation.teacherName}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <SchoolIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }} />
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>{allocation.subject}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <Box sx={{ display: 'inline-flex', px: 1.5, py: 0.5, bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', borderRadius: 2, fontWeight: 'bold', fontSize: '0.8rem' }}>
                            <ClassIcon sx={{ fontSize: 14, mr: 1 }} /> {allocation.className}
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <Tooltip title="O'chirish">
                            <IconButton 
                              onClick={() => handleDelete(allocation.id)}
                              sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 10, border: 'none' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }}>
                          {t('no_allocations_found') || 'Hech qanday biriktiruv topilmadi'}
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
