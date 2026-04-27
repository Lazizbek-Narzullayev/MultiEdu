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
  CircularProgress
} from "@mui/material";
import { 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  LocalShipping as TransportIcon
} from "@mui/icons-material";
import NavbarWithDrawer from "../../Components/NavDrawer";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

export default function TransportList() {
  const { t } = useTranslation();
  const [transportList, setTransportList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTransport = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "transport"));
      setTransportList(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error fetching transport:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransport();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t('delete_confirm_title') || 'O\'chirishni tasdiqlaysizmi?',
      text: t('delete_confirm_text') || 'Ushbu yozuvni qayta tiklab bo\'lmaydi!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#1976d2',
      confirmButtonText: t('yes_delete') || 'Ha, o\'chirish',
      cancelButtonText: t('cancel') || 'Bekor qilish'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "transport", id));
        setTransportList((prev) => prev.filter((item) => item.id !== id));
        Swal.fire(t('success'), t('deleted_msg'), 'success');
      } catch (error) {
        Swal.fire(t('error'), t('error_msg'), 'error');
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
                {t('transport_list_title') || t('transportation', 'Transport')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                Tizimdagi barcha transport yo'nalishlari va haydovchilar boshqaruvi
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
              onClick={() => navigate("/transport/form")}
            >
              {t('add_transport_btn') || t('add_new', 'Yangi qo\'shish')}
            </Button>
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
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>ID</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>Yo'nalish / Talaba</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }} align="center">To'lov</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }} align="right">Amallar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : transportList.length > 0 ? (
                  transportList.map((item) => (
                    <TableRow 
                      key={item.id}
                      sx={{ '&:hover': { bgcolor: '#f8fafc' } }}
                    >
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontFamily: 'monospace' }}>
                        #{item.id.substring(0, 6)}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar variant="rounded" sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2', borderRadius: 1 }}>
                            <TransportIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography sx={{ color: '#1e293b', fontWeight: 'bold' }}>{item.routeName || item.studentName}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>{item.vehicleModel || item.routeVehicle}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Typography sx={{ color: '#1e293b', fontWeight: 'bold' }}>
                          {item.charges} so'm
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <IconButton 
                          onClick={() => handleDelete(item.id)}
                          sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                      <Typography sx={{ color: '#cbd5e1', fontWeight: 'bold' }}>
                        Hech qanday yozuv topilmadi
                      </Typography>
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
