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
  MenuBook as SubjectIcon, 
  Class as ClassIcon, 
  Description as DescriptionIcon, 
  AccessTime as AccessTimeIcon,
  LibraryBooks as SyllabusIcon
} from "@mui/icons-material";
import NavbarWithDrawer from "../../Components/NavDrawer";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

export default function SyllabusList() {
  const { t } = useTranslation();
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch syllabus
  const fetchSyllabus = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "syllabus"));
      setSyllabus(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error fetching syllabus:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
  }, []);

  // Delete syllabus
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'O\'chirishni tasdiqlaysizmi?',
      text: "Ushbu o'quv dasturini qayta tiklab bo'lmaydi!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#84cc16',
      confirmButtonText: 'Ha, o\'chirish',
      cancelButtonText: 'Bekor qilish',
      background: '#1e293b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "syllabus", id));
        setSyllabus((prev) => prev.filter((s) => s.id !== id));
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
                {t('syllabus_list_title') || t('syllabus', 'O\'quv dasturi')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                Guruhlar uchun tasdiqlangan barcha o'quv rejalari va dasturlari
              </Typography>
            </Box>
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
              onClick={() => navigate("/syllabus/form")}
            >
              {t('add_syllabus_btn') || t('add_new', 'Yangi qo\'shish')}
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
                <Avatar sx={{ bgcolor: 'rgba(132, 204, 22, 0.1)', color: '#84cc16', width: 44, height: 44 }}>
                    <SyllabusIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff' }}>
                    O'quv Rejalari
                </Typography>
            </Box>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: 'none', py: 3 }}>ID</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: 'none' }}>Fan nomi</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: 'none' }}>Sinf</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: 'none' }}>Tavsif</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: 'none' }}>Davomiyligi</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: '900', borderBottom: 'none' }} align="right">Amallar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 10, border: 'none' }}>
                            <CircularProgress sx={{ color: '#84cc16' }} />
                        </TableCell>
                    </TableRow>
                ) : syllabus.length > 0 ? (
                  syllabus.map((s) => (
                    <TableRow 
                      key={s.id}
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                        transition: '0.3s'
                      }}
                    >
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', py: 3 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontWeight: 900 }}>
                          #{s.id.substring(0, 6)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'rgba(132, 204, 22, 0.1)', color: '#84cc16', fontWeight: 900, fontSize: '0.85rem', width: 36, height: 36, border: '1px solid rgba(132, 204, 22, 0.2)' }}>
                            {s.subjectName?.charAt(0)}
                          </Avatar>
                          <Typography sx={{ color: '#fff', fontWeight: 800 }}>{s.subjectName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 800, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{s.className}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography noWrap sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 250 }}>{s.description}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <AccessTimeIcon sx={{ fontSize: 16, color: '#84cc16' }} />
                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 800 }}>{s.duration}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Tooltip title="O'chirish">
                          <IconButton 
                            onClick={() => handleDelete(s.id)}
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
                    <TableCell colSpan={6} align="center" sx={{ py: 15, border: 'none' }}>
                      <Box sx={{ opacity: 0.2 }}>
                        <SyllabusIcon sx={{ fontSize: 60, mb: 2, color: 'rgba(255,255,255,0.3)' }} />
                        <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem' }}>
                          Hech qanday o'quv dasturi topilmadi
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
