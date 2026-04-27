import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  CssBaseline,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
} from "@mui/material";
import { logout } from "../store/Slice/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";
import { useTranslation } from "react-i18next";

import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import TableChartIcon from "@mui/icons-material/TableChart";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import CommuteIcon from "@mui/icons-material/Commute";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import SchoolIcon from "@mui/icons-material/School";


import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import SubjectIcon from "@mui/icons-material/LibraryBooks";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DescriptionIcon from "@mui/icons-material/Description";
import ClassIcon from "@mui/icons-material/Class";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AssessmentIcon from '@mui/icons-material/Assessment';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';


// Sub item icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InsightsIcon from "@mui/icons-material/Insights";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupIcon from "@mui/icons-material/Group";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

import { useDispatch, useSelector } from "react-redux";

const drawerWidth = 280;
const mobileDrawerWidth = '85vw';

// Drawer items with sub-item icons
import HomeIcon from "@mui/icons-material/Home";

// Drawer items with role-based visibility
const drawerItems = [
  {
    title: "Bosh sahifa",
    key: "menu_dashboard",
    icon: <HomeIcon />,
    path: "/dashboard",
    subItems: []
  },
  {
    title: "Mening kurslarim",
    key: "menu_my_courses",
    icon: <SchoolIcon />,
    roles: ["student", "teacher"],
    path: "/courses",
    subItems: [],
  },
  {
    title: "Darslar",
    key: "menu_all_courses",
    icon: <MenuBookIcon />,
    roles: ["student", "super-admin"],
    path: "/lessons",
    subItems: []
  },
  {
    title: "Foydalanuvchilar",
    icon: <PeopleIcon />,
    roles: ["admin", "super-admin"],
    path: "/admin/management",
    subItems: []
  },
  {
    title: "Sozlamalar",
    key: "menu_settings",
    path: "/settings",
    roles: ["teacher", "student", "super-admin"],
    icon: <SettingsIcon />,
    subItems: []
  },
];

const NavbarWithDrawer = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const location = useLocation();

  const token = user?.token;

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { 'x-auth-token': token }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleToggleMenu = (index) =>
    setOpenMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;
    try {
      await axios.put(`${API_BASE_URL}/notifications/read-all`, {}, {
        headers: { 'x-auth-token': token }
      });
      setNotifications([]);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!token) return;
    try {
      await axios.put(`${API_BASE_URL}/notifications/${notif._id}/read`, {}, {
        headers: { 'x-auth-token': token }
      });
      setNotifications(prev => prev.filter(n => n._id !== notif._id));
      
      if (notif.courseId) {
        navigate(`/courses/${notif.courseId._id || notif.courseId}`);
      } else if (notif.lessonId) {
        navigate(`/lessons/${notif.lessonId._id || notif.lessonId}`);
      }
      handleNotifClose();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box 
        sx={{ 
          p: 4, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          cursor: 'pointer'
        }}
        onClick={() => navigate(user?.role === 'student' ? '/student-dashboard' : '/dashboard')}
      >
        <Box sx={{ 
          width: 40, 
          height: 40, 
          bgcolor: '#7c3aed', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
        }}>
          <SchoolIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b', fontSize: '1.25rem', letterSpacing: -0.5 }}>
          MultiEdu
        </Typography>
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        {drawerItems
          .filter(item => !item.roles || item.roles.includes(user?.role))
          .map((item, index) => {
            const itemPath = item.key === "menu_dashboard" ? (user?.role === "student" ? "/student-dashboard" : "/dashboard") : item.path;
            const active = isActive(itemPath);
            
            return (
              <Box key={item.title} sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={itemPath}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: '16px',
                    py: 1.5,
                    px: 3,
                    bgcolor: active ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                    color: active ? '#7c3aed' : '#64748b',
                    '&:hover': {
                      bgcolor: 'rgba(124, 58, 237, 0.04)',
                      color: '#7c3aed',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 40, 
                    color: active ? '#7c3aed' : '#94a3b8',
                    '& svg': { fontSize: 22 }
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.key ? t(item.key) : item.title}
                    primaryTypographyProps={{ 
                      fontWeight: active ? 800 : 600,
                      fontSize: '0.95rem'
                    }}
                  />
                </ListItemButton>
              </Box>
            );
          })}
      </List>

      <Box sx={{ p: 3, borderTop: '1px solid #f1f5f9' }}>
        <ListItemButton
          onClick={() => navigate('/help')}
          sx={{ borderRadius: '16px', color: '#64748b', mb: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#94a3b8' }}><HelpOutlineIcon /></ListItemIcon>
          <ListItemText primary="Yordam" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }} />
        </ListItemButton>
        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: '16px', color: '#ef4444' }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#ef4444' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Chiqish" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: 'white', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          ml: isDesktop ? `${drawerWidth}px` : 0,
          width: isDesktop ? `calc(100% - ${drawerWidth}px)` : "100%",
          bgcolor: '#f8fafc',
          borderBottom: '1px solid #f1f5f9',
          boxShadow: 'none',
          color: '#1e293b'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isDesktop && (
              <IconButton edge="start" onClick={handleDrawerToggle} sx={{ color: '#64748b' }}>
                <MenuIcon />
              </IconButton>
            )}
            {/* Search removed as requested */}
            <Typography variant="h5" sx={{ fontWeight: 950, color: '#1e293b', display: { xs: 'none', sm: 'block' }, letterSpacing: '-0.02em' }}>
              Raqamli texnologiyalar va innovatsiyalar
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
            <IconButton onClick={handleNotifClick} sx={{ bgcolor: '#f8fafc', p: 1 }}>
              <Badge badgeContent={notifications.length} color="error" overlap="circular">
                <NotificationsIcon sx={{ color: '#64748b', fontSize: 22 }} />
              </Badge>
            </IconButton>

            {/* Notification Menu */}
            <Menu
              anchorEl={notifAnchorEl}
              open={Boolean(notifAnchorEl)}
              onClose={handleNotifClose}
              PaperProps={{
                sx: {
                  width: 320,
                  maxHeight: 400,
                  borderRadius: '24px',
                  mt: 1.5,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  p: 1
                }
              }}
            >
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Bildirishnomalar</Typography>
                <Typography 
                  variant="caption" 
                  sx={{ color: '#7c3aed', fontWeight: 800, cursor: 'pointer' }}
                  onClick={handleMarkAllAsRead}
                >
                  Hammasini o'qilgan qilish
                </Typography>
              </Box>
              <Divider />
              {notifications.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <MarkEmailReadIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>Hozircha yangi bildirishnomalar yo'q</Typography>
                </Box>
              ) : (
                notifications.map((notif, i) => (
                  <MenuItem 
                    key={i} 
                    onClick={() => handleNotificationClick(notif)}
                    sx={{ py: 1.5, borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, borderBottom: i !== notifications.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Box sx={{ w: 8, h: 8, borderRadius: 'full', bgcolor: 'primary.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{notif.title || 'Bildirishnoma'}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', ml: 2 }}>{notif.messageText}</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', ml: 2, mt: 0.5 }}>
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString() : 'Hozirgina'}
                    </Typography>
                  </MenuItem>
                ))
              )}
            </Menu>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={handleProfileClick}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.85rem' }}>{user?.name}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem' }}>{user?.role === 'student' ? 'O\'quvchi' : 'O\'qituvchi'}</Typography>
              </Box>
              <Avatar 
                src={user?.avatarUrl}
                sx={{ 
                  width: 40, 
                  height: 40, 
                  border: '2px solid white',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
            </Box>
            
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} PaperProps={{ sx: { borderRadius: '16px', mt: 1 } }}>
              <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>Profil</MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Chiqish</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open={isDesktop ? true : mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#f8fafc',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${drawerWidth}px` },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1, p: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default NavbarWithDrawer;
