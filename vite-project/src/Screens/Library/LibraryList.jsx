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
import { Delete, Add as AddIcon, Person, Book, MonetizationOn, LibraryBooks as LibraryIcon } from "@mui/icons-material";
import NavbarWithDrawer from "../../Components/NavDrawer";
import { useTranslation } from "react-i18next";

export default function LibraryList() {
  const { t } = useTranslation();
  const [library, setLibrary] = useState([]);
  const navigate = useNavigate();

  // Fetch library records
  const fetchLibrary = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "library"));
      setLibrary(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error fetching library records:", error);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  // Delete record
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "library", id));
      setLibrary((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting library record:", error);
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
                {t('library_records_title') || t('library', 'Kutubxona')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                {t('library_subtitle', 'Kitobxonlar va olingan kitoblar nazorati')}
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
              onClick={() => navigate("/library/form")}
            >
              {t('add_library_btn') || t('add_new', 'Yangi qo\'shish')}
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
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>ID</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>Foydalanuvchi</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }}>Kitob nomi</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }} align="center">To'lovlar</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: '900', borderBottom: '1px solid #e2e8f0' }} align="right">Amallar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {library.length > 0 ? (
                  library.map((item) => (
                    <TableRow 
                      key={item.id}
                      sx={{ 
                        '&:hover': { bgcolor: '#f8fafc' },
                        transition: '0.3s'
                      }}
                    >
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Typography sx={{ color: '#94a3b8', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          #{item.id.substring(0, 6)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2', fontWeight: 'bold', fontSize: '0.8rem' }}>
                            <Person fontSize="small" />
                          </Avatar>
                          <Typography sx={{ color: '#1e293b', fontWeight: 'bold' }}>{item.userName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Book sx={{ color: '#1976d2', fontSize: 20 }} />
                          <Typography sx={{ color: '#475569' }}>{item.bookName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Box sx={{ 
                          display: 'inline-flex', 
                          px: 2, 
                          py: 0.5, 
                          bgcolor: '#fff7ed', 
                          color: '#c2410c', 
                          borderRadius: 2,
                          fontWeight: '900',
                          fontSize: '0.8rem',
                          border: '1px solid #ffedd5'
                        }}>
                          {item.charges} so'm
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Tooltip title="O'chirish">
                          <IconButton 
                            onClick={() => handleDelete(item.id)}
                            sx={{ color: '#ef4444', bgcolor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 1, '&:hover': { bgcolor: '#ef4444', color: '#fff' }, transition: '0.3s' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 10, border: 'none' }}>
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
