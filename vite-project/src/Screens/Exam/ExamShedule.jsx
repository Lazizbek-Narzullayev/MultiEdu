import React from "react";
import NavbarWithDrawer from "../../Components/NavDrawer";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Container,
  Avatar,
  Stack,
  Chip
} from "@mui/material";
import { 
  AccessTime as AccessTimeIcon, 
  Event as EventIcon, 
  MenuBook as SubjectIcon, 
  Class as ClassIcon, 
  Schedule as ScheduleIcon,
  Timer as DurationIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function ExamSchedule() {
  const { t } = useTranslation();
  // Static data for exam schedule
  const schedule = [
    {
      id: 1,
      subject: "Mathematics",
      className: "10-sinf",
      date: "2025-09-01",
      time: "09:00 - 12:00",
      duration: "3 soat",
      location: "B bino, 204-xona"
    },
    {
      id: 2,
      subject: "English",
      className: "10-sinf",
      date: "2025-09-03",
      time: "09:00 - 12:00",
      duration: "3 soat",
      location: "A bino, 105-xona"
    },
    {
      id: 3,
      subject: "Physics",
      className: "10-sinf",
      date: "2025-09-05",
      time: "14:00 - 17:00",
      duration: "3 soat",
      location: "C bino, 301-xona"
    },
    {
      id: 4,
      subject: "Chemistry",
      className: "10-sinf",
      date: "2025-09-07",
      time: "09:00 - 12:00",
      duration: "3 soat",
      location: "C bino, 302-xona"
    },
    {
      id: 5,
      subject: "Computer Science",
      className: "10-sinf",
      date: "2025-09-09",
      time: "14:00 - 17:00",
      duration: "3 soat",
      location: "IT markazi, L-1"
    },
    {
      id: 6,
      subject: "O'zbek tili",
      className: "10-sinf",
      date: "2025-09-11",
      time: "14:00 - 17:00",
      duration: "3 soat",
      location: "A bino, 404-xona"
    },
  ];

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
                {t('exam_schedule_title') || t('exams', 'Imtihonlar jadvali')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                Yaqinlashib kelayotgan barcha imtihonlar va test sinovlari jadvali
              </Typography>
            </Box>
            <Avatar sx={{ width: 64, height: 64, bgcolor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd' }}>
              <ScheduleIcon fontSize="large" />
            </Avatar>
          </Box>

          <Grid container spacing={4}>
            {schedule.map((exam) => (
              <Grid item xs={12} sm={6} md={4} key={exam.id}>
                <Paper
                  className="glass-dark"
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 8,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      borderColor: 'rgba(6, 182, 212, 0.4)',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                      '& .MuiAvatar-root': {
                        transform: 'rotate(10deg) scale(1.1)',
                        bgcolor: 'rgba(6, 182, 212, 0.2)'
                      }
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "900", color: "#fff", borderLeft: '4px solid #06b6d4', pl: 2 }}
                    >
                      {exam.subject}
                    </Typography>
                    <Chip 
                        label={exam.className} 
                        size="small"
                        sx={{ 
                            bgcolor: 'rgba(6, 182, 212, 0.1)', 
                            color: '#06b6d4', 
                            fontWeight: 900,
                            border: '1px solid rgba(6, 182, 212, 0.2)',
                            borderRadius: 1.5
                        }} 
                    />
                  </Box>

                  <Stack spacing={3}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#06b6d4', transition: '0.3s' }}>
                        <EventIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 900, display: 'block', textTransform: 'uppercase' }}>Sana</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800 }}>{exam.date}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#f59e0b', transition: '0.3s' }}>
                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 900, display: 'block', textTransform: 'uppercase' }}>Vaqt</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800 }}>{exam.time}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#10b981', transition: '0.3s' }}>
                        <DurationIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 900, display: 'block', textTransform: 'uppercase' }}>Davomiyligi</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800 }}>{exam.duration}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#ef4444', transition: '0.3s' }}>
                        <LocationIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 900, display: 'block', textTransform: 'uppercase' }}>Manzil</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 800 }}>{exam.location}</Typography>
                      </Box>
                    </Box>
                  </Stack>

                  <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
                      ID: EXM-{exam.id}0{exam.id}
                    </Typography>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#06b6d4', boxShadow: '0 0 10px #06b6d4' }} />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </NavbarWithDrawer>
  );
}
