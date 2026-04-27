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
  Stack,
  CircularProgress
} from "@mui/material";
import { 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Person as PersonIcon, 
  Phone as PhoneIcon, 
  DateRange as DateIcon, 
  Grade as GradeIcon, 
  Wc as GenderIcon,
  Class as ClassIcon,
  Groups as GroupsIcon
} from "@mui/icons-material";
import NavbarWithDrawer from "../../Components/NavDrawer";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

export default function ClassList() {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch class records
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "classes"));
      setRecords(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error fetching class records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Delete record
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t('delete_confirm_title') || 'O\'chirishni tasdiqlaysizmi?',
      text: t('delete_confirm_text') || 'Ushbu sinf yozuvini qayta tiklab bo\'lmaydi!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#f43f5e',
      confirmButtonText: t('yes_delete') || 'Ha, o\'chirish',
      cancelButtonText: t('cancel') || 'Bekor qilish',
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "classes", id));
        setRecords((prev) => prev.filter((r) => r.id !== id));
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
                {t('class_list_title') || t('classes', 'Sinf / Guruhlar')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                Tizimdagi barcha sinflar va o'quv guruhlari boshqaruvi
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
              onClick={() => navigate("/classes/add")}
            >
              {t('add_class_btn') || t('add_new', 'Yangi qo\'shish')}
            </Button>
          </Box>

          {/* Table Area */}
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              bgcolor: '#fff',
              mb: 4
            }}
          >
            <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Avatar variant="rounded" sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2', width: 44, height: 44, borderRadius: 2 }}>
                    <ClassIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b' }}>
                    Sinf Ma'lumotlari
                </Typography>
            </Box>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0', py: 3 }}>ID</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>Talaba</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>{t('col_dob') || 'Tug\'ilgan sana'}</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>{t('col_prev_grade') || 'Oldingi baho'}</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>{t('col_phone') || 'Telefon'}</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>{t('col_gender') || 'Jinsi'}</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }} align="right">Amallar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 10, border: 'none' }}>
                            <CircularProgress sx={{ color: '#1976d2' }} />
                        </TableCell>
                    </TableRow>
                ) : records.length > 0 ? (
                  records.map((r) => (
                    <TableRow 
                      key={r.id}
                      sx={{ 
                        '&:hover': { bgcolor: '#f8fafc' },
                        transition: '0.3s'
                      }}
                    >
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9', py: 3 }}>
                        <Typography sx={{ color: '#94a3b8', fontFamily: 'monospace', fontWeight: 900 }}>
                          #{r.id.substring(0, 6)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar variant="rounded" sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2', fontWeight: 900, fontSize: '0.85rem', width: 36, height: 36, border: '1px solid rgba(25, 118, 210, 0.2)', borderRadius: 1 }}>
                            {r.firstName?.charAt(0)}
                          </Avatar>
                          <Typography sx={{ color: '#1e293b', fontWeight: 800 }}>{r.firstName} {r.lastName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <DateIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                          <Typography sx={{ color: '#475569', fontWeight: 800 }}>{r.dob}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Box sx={{ 
                            display: 'inline-flex', 
                            px: 1.5, 
                            py: 0.5, 
                            bgcolor: '#f1f5f9', 
                            color: '#1e293b', 
                            borderRadius: 1,
                            fontWeight: 900,
                            border: '1px solid #e2e8f0'
                        }}>
                            {r.prevGrade}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Typography sx={{ color: '#475569', fontWeight: 800 }}>{r.phone}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Typography sx={{ color: '#475569', fontWeight: 800 }}>{r.gender}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Tooltip title="O'chirish">
                          <IconButton 
                            onClick={() => handleDelete(r.id)}
                            sx={{ color: '#ef4444', bgcolor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 1, '&:hover': { bgcolor: '#ef4444', color: '#fff' }, transition: '0.3s' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 15, border: 'none' }}>
                      <Box sx={{ opacity: 0.5 }}>
                        <GroupsIcon sx={{ fontSize: 60, mb: 2, color: '#cbd5e1' }} />
                        <Typography sx={{ color: '#64748b', fontWeight: 900, fontSize: '1.2rem' }}>
                          Hech qanday sinf yozuvi topilmadi
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
