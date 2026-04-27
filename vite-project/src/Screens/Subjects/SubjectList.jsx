import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Stack,
  IconButton,
  Paper,
  Box,
  Typography,
  Tooltip,
  CircularProgress,
  Container,
  Avatar,
  Divider,
} from "@mui/material";
import { 
  Delete as DeleteIcon, 
  AutoAwesome as AutoAwesomeIcon, 
  MenuBook as MenuBookIcon, 
  Class as ClassIcon, 
  Groups as GroupsIcon,
  PlayCircleOutline as PlayIcon
} from "@mui/icons-material";
import NavbarWithDrawer from "../../Components/NavDrawer";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

export default function SubjectList() {
  const { t } = useTranslation();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch subjects from Firestore
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "subjects"));
      setSubjects(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Delete subject
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t('delete_confirm_title') || 'O\'chirishni tasdiqlaysizmi?',
      text: t('delete_confirm_text') || 'Ushbu fanni qayta tiklab bo\'lmaydi!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#8b5cf6',
      confirmButtonText: t('yes_delete') || 'Ha, o\'chirish',
      cancelButtonText: t('cancel') || 'Bekor qilish',
      background: '#1e293b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "subjects", id));
        setSubjects((prev) => prev.filter((subject) => subject.id !== id));
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
          {/* Header Section */}
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
                {t('subjects_list_title') || t('subjects', 'Fanlar')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                Tizimdagi barcha fanlar va o'quv dasturlari boshqaruvi
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
              onClick={() => navigate("/subjects/add")}
            >
              {t('add_subject_btn') || t('add_new', 'Yangi qo\'shish')}
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 15 }}>
              <CircularProgress sx={{ color: '#8b5cf6' }} />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={subject.id}>
                    <Paper
                      className="glass-dark"
                      sx={{
                        p: 0,
                        height: '100%',
                        borderRadius: 8,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        '&:hover': {
                          transform: 'translateY(-12px)',
                          borderColor: 'rgba(139, 92, 246, 0.4)',
                          boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                        }
                      }}
                    >
                      <Box sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'flex-start' }}>
                          <Avatar sx={{ 
                            bgcolor: 'rgba(139, 92, 246, 0.1)', 
                            color: '#8b5cf6', 
                            borderRadius: 4,
                            width: 60,
                            height: 60,
                            border: '1px solid rgba(139, 92, 246, 0.2)'
                          }}>
                            <MenuBookIcon fontSize="large" />
                          </Avatar>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(subject.id)}
                            sx={{ color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Typography variant="h5" sx={{ fontWeight: '900', mb: 3, color: '#fff', letterSpacing: '-0.02em', height: '3.6rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {subject.subjectName}
                        </Typography>

                        <Stack spacing={2.5}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
                              <ClassIcon fontSize="small" />
                            </Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 800 }}>
                              {subject.className}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
                              <GroupsIcon fontSize="small" />
                            </Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 800 }}>
                              {subject.group}
                            </Typography>
                          </Box>
                        </Stack>

                        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.05)' }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontWeight: 800 }}>
                            #{subject.id.substring(0, 8)}
                          </Typography>
                          <Button 
                            endIcon={<PlayIcon sx={{ fontSize: '1rem !important' }} />}
                            onClick={() => navigate(`/subjects/${subject.id}`)}
                            sx={{ 
                              fontWeight: '900', 
                              textTransform: 'none', 
                              color: '#8b5cf6',
                              p: 0,
                              minWidth: 0,
                              '&:hover': { bgcolor: 'transparent', color: '#fff' }
                            }}
                          >
                            Batafsil
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper className="glass-dark" sx={{ p: 12, textAlign: 'center', borderRadius: 8, border: '2px dashed rgba(255,255,255,0.05)' }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.1)', mx: 'auto', mb: 3 }}>
                      <MenuBookIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 900 }}>
                      {t('no_subjects_found') || 'Hozircha hech qanday fan qo\'shilmagan'}
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{ mt: 4, borderRadius: 3, fontWeight: 900, color: '#8b5cf6', borderColor: '#8b5cf6' }}
                      onClick={() => navigate("/subjects/add")}
                    >
                      Birinchi fanni qo'shing
                    </Button>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </Container>
      </Box>
    </NavbarWithDrawer>
  );
}
