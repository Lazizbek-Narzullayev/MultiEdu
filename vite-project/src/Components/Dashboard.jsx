import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  useTheme,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardIcon from '@mui/icons-material/Dashboard';

import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import ClassIcon from '@mui/icons-material/Class';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NavbarWithDrawer from './NavDrawer';
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";



import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

import SuperAdminDashboard from '../Screens/Admin/SuperAdminDashboard';
import TeacherDashboard from '../Screens/Teacher/TeacherDashboard';
import TeacherHome from '../Screens/Teacher/TeacherHome';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);

  // Rolga qarab mos dashboardni qaytarish
  if (user?.role === 'super-admin') {
    return <SuperAdminDashboard />;
  }

  if (user?.role === 'teacher') {
    return <TeacherHome />;
  }

  const dashboardSections = [
    { title: t('dash_courses_title'), description: t('dash_courses_desc'), icon: <SchoolIcon fontSize="large" />, path: '/courses' },
    { title: t('dash_lessons_title'), description: t('dash_lessons_desc'), icon: <PlayCircleOutlineIcon fontSize="large" />, path: '/lessons' },
    { title: t('dash_review_title'), description: t('dash_review_desc'), icon: <AssessmentIcon fontSize="large" />, path: '#reviews' },
  ];

  return (
    <NavbarWithDrawer>
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 8 },
        width: '100%',
        bgcolor: '#f1f5f9'
      }}>
        <Box sx={{ maxWidth: '1200px', width: '100%' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 6,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <DashboardIcon sx={{ fontSize: 48, color: '#1976d2' }} />
            {t('dashboard_welcome')}
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {dashboardSections.map((section) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={section.title}>
                <Card
                  elevation={1}
                  sx={{
                    height: '100%',
                    borderRadius: 1,
                    bgcolor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      borderColor: '#1976d2'
                    }
                  }}
                >
                  <CardActionArea onClick={() => navigate(section.path)} sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box sx={{ 
                        mb: 3, 
                        display: 'inline-flex', 
                        p: 2, 
                        borderRadius: 1, 
                        bgcolor: 'rgba(25, 118, 210, 0.1)', 
                        color: '#1976d2'
                      }}>
                        {section.icon}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
                        {section.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                        {section.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

        </Box>
      </Box>
    </NavbarWithDrawer>
  );
};

export default Dashboard;
