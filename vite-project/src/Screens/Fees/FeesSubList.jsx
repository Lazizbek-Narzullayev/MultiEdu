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
  Stack
} from "@mui/material";
import { Delete, Add as AddIcon, Person, Class, MonetizationOn, CalendarToday, Paid as PaidIcon } from "@mui/icons-material";
import NavbarWithDrawer from "../../Components/NavDrawer";
import { useTranslation } from "react-i18next";

export default function FeeSubmissionList() {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "feeSubmissions"));
      setSubmissions(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error fetching fee submissions:", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Delete submission
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "feeSubmissions", id));
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting fee submission:", error);
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
              mb: 8,
              p: 4,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              bgcolor: '#fff'
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ color: "#1e293b", fontWeight: "900" }}>
                {t('fee_submissions_title') || t('fees_history', 'To\'lovlar tarixi')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                Talabalar tomonidan amalga oshirilgan barcha to'lovlar jurnali
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: "#2563eb",
                color: "#fff",
                fontWeight: "900",
                borderRadius: 4,
                px: 4,
                py: 1.5,
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #059669, #047857)",
                  transform: "translateY(-2px)",
                  boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)'
                },
                transition: "all 0.3s"
              }}
              onClick={() => navigate("/fees/submit")}
            >
              {t('add_fee_btn') || t('add_new', 'Yangi qo\'shish')}
            </Button>
          </Box>

          {/* Table Area */}
          <TableContainer
            component={Paper}
            elevation={1}
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
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>Talaba ismi</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>Sinf</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }} align="center">Miqdor</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }} align="center">Sana</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }} align="right">Amallar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.length > 0 ? (
                  submissions.map((s) => (
                    <TableRow 
                      key={s.id}
                      sx={{ 
                        '&:hover': { bgcolor: '#f1f5f9' },
                        transition: '0.3s'
                      }}
                    >
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Typography sx={{ color: '#94a3b8', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          #{s.id.substring(0, 6)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: '#eff6ff', color: '#1976d2', fontWeight: 'bold', fontSize: '0.8rem' }}>
                            <Person fontSize="small" />
                          </Avatar>
                          <Typography sx={{ color: '#334155', fontWeight: 'bold' }}>{s.studentName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#475569', fontWeight: 'bold', borderBottom: '1px solid #f1f5f9' }}>{s.className}</TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Box sx={{ 
                          display: 'inline-flex', 
                          px: 2, 
                          py: 0.5, 
                          bgcolor: '#f0fdf4', 
                          color: '#10b981', 
                          borderRadius: 1,
                          fontWeight: '900',
                          fontSize: '0.85rem',
                          border: '1px solid #dcfce7'
                        }}>
                          {s.amount} so'm
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                          <CalendarToday sx={{ color: '#94a3b8', fontSize: 16 }} />
                          <Typography sx={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.9rem' }}>{s.date}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Tooltip title="O'chirish">
                          <IconButton 
                            onClick={() => handleDelete(s.id)}
                            sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 10, border: 'none' }}>
                      <Typography sx={{ color: '#94a3b8', fontWeight: 'bold' }}>
                        Hech qanday to'lov topilmadi
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
