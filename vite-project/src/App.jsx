import './App.css'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LogIn from './Components/Form/Login'
import SignUp from './Components/Form/SignUp'
import Dashboard from './Components/Dashboard'
import StudentDashboard from './Components/StudentDashboard'
import StudentList from './Screens/Students/StudentList'
import AddStudent from './Screens/Students/StudentAdd'
import TransferStudent from './Screens/Students/StudentTransfer'
import TeacherList from './Screens/Teachers/TeacherList'
import AddTeacher from './Screens/Teachers/TeacherAdd'
import TeacherAllocationList from './Screens/Teachers/TeacherAllocList'
import AddTeacherAllocation from './Screens/Teachers/TeacherAlloctAdd'
import SubjectAdd from './Screens/Subjects/SubjectAdd'
import SubjectList from './Screens/Subjects/SubjectList'
import ClassList from './Screens/Class/ClassList'
import ClassForm from './Screens/Class/ClassForm'
import SyllabusAdd from './Screens/Syllabus/SyllabusForm'
import SyllabusList from './Screens/Syllabus/SyllabusList'
import FeeSubmissionList from './Screens/Fees/FeesSubList'
import FeeSubmission from './Screens/Fees/FeesSubmitForm'
import FeeVoucher from './Screens/Fees/FeesVouch'
import FeeStructure from './Screens/Fees/FeesStructure'
import ProtectedRoute from './Routes/ProtectedRoute'
import NotFound from './Screens/NotFound'
import ExamAdd from './Screens/Exam/ExamAdd'
import ExamList from './Screens/Exam/ExamResult'
import ExamSchedule from './Screens/Exam/ExamShedule'
import LibraryList from './Screens/Library/LibraryList'
import { LibraryAdd } from '@mui/icons-material'
import LibraryForm from './Screens/Library/LibraryForm'
import TransportList from './Screens/Transport/TransportList'
import TransportForm from './Screens/Transport/TransportForm'
import AdminManagement from './Components/Admin/AdminManagement'
import LessonList from './Components/Multimodal/LessonList'
import LessonForm from './Components/Multimodal/LessonForm'
import LessonViewer from './Components/Multimodal/LessonViewer'
import QuizViewer from './Screens/Quiz/QuizViewer'
import LessonQuiz from './Screens/Quiz/LessonQuiz'
import LandingPage from './Components/LandingPage'
import CourseList from './Components/Courses/CourseList'
import CourseDetail from './Components/Courses/CourseDetail'
import Settings from "./Components/Settings/Settings";
import TeacherDashboard from './Screens/Teacher/TeacherDashboard';
import TeacherCalendar from './Screens/Teacher/TeacherCalendar';
import SuperAdminDashboard from './Screens/Admin/SuperAdminDashboard';
import HelpPage from './Screens/Help/HelpPage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { telegramLogin, verifyToken } from './store/Slice/authSlice';

// TMA Components
import TMALayout from './Components/TMA/TMALayout';
import TMAHome from './Components/TMA/TMAHome';
import TMACourses from './Components/TMA/TMACourses';
import TMALesson from './Components/TMA/TMALesson';
import TMANotifications from './Components/TMA/TMANotifications';
import TMAProfile from './Components/TMA/TMAProfile';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Har doim app yuklananda token tekshiruvi
    dispatch(verifyToken());

    // Telegram WebApp detection
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initData && !isAuthenticated) {
      tg.expand();
      dispatch(telegramLogin(tg.initData));
    }

    // If in Telegram and authenticated, redirect to TMA home if not already there
    if (tg && tg.initData && isAuthenticated && !window.location.pathname.startsWith('/tma')) {
      navigate('/tma/home');
    }
  }, [dispatch, isAuthenticated, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f8fafc' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'student' ? "/student-dashboard" : "/dashboard"} replace />
          ) : (
            <LogIn />
          )
        } />
        <Route path="/signup" element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'student' ? "/student-dashboard" : "/dashboard"} replace />
          ) : (
            <SignUp />
          )
        } />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/admin/management" element={<AdminManagement />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/lessons" element={<LessonList />} />
          <Route path="/lessons/add" element={<LessonForm />} />
          <Route path="/lessons/:id" element={<LessonViewer />} />
          <Route path="/lessons/:id/quiz" element={<LessonQuiz />} />
          <Route path="/quiz/:id" element={<QuizViewer />} />

          {/* student section */}
          <Route path="/students/list" element={<StudentList />} />
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/transfer" element={<TransferStudent />} />
          {/* teacher section */}
          <Route path="/teachers/list" element={<TeacherList />} />
          <Route path="/teachers/add" element={<AddTeacher />} />
          <Route path="/teachers/alloctlist" element={<TeacherAllocationList />} />
          <Route path="/teachers/alloctadd" element={<AddTeacherAllocation />} />
          {/* subjects routes */}
          <Route path="/subjects/add" element={<SubjectAdd />} />
          <Route path="/subjects/list" element={<SubjectList />} />
          {/* class routes */}
          <Route path="/class/list" element={<ClassList />} />
          <Route path="/class/form" element={<ClassForm />} />
          {/* syllabus routes */}
          <Route path="/syllabus/form" element={<SyllabusAdd />} />
          <Route path="/syllabus/list" element={<SyllabusList />} />
          {/* fee routes */}
          <Route path="/fees/sublist" element={<FeeSubmissionList />} />
          <Route path="/fees/subform" element={<FeeSubmission />} />
          <Route path="/fees/voucher" element={<FeeVoucher />} />
          <Route path="/fees/structure" element={<FeeStructure />} />
          {/* exam routes */}
          <Route path="/exam/resultadd" element={<ExamAdd />} />
          <Route path="/exam/resultlist" element={<ExamList />} />
          <Route path="/exam/schedule" element={<ExamSchedule />} />
          {/* library route */}
          <Route path="/library/list" element={<LibraryList />} />
          <Route path="/library/form" element={<LibraryForm />} />
          {/* transport routes */}
          <Route path="/transport/list" element={<TransportList />} />
          <Route path="/transport/form" element={<TransportForm />} />

          {/* Teacher Analytics & Calendar */}
          <Route path="/teacher/stats" element={<TeacherDashboard />} />
          <Route path="/teacher/calendar" element={<TeacherCalendar />} />
          <Route path="/admin/stats" element={<SuperAdminDashboard />} />
        </Route>

        {/* Telegram Mini App Specialized Routes */}
        <Route path="/tma" element={<TMALayout />}>
          <Route index element={<Navigate to="/tma/home" />} />
          <Route path="home" element={<TMAHome />} />
          <Route path="courses" element={<TMACourses />} />
          <Route path="courses/:courseId" element={<TMALesson />} />
          <Route path="courses/:courseId/lesson/:lessonId" element={<TMALesson />} />
          <Route path="notifications" element={<TMANotifications />} />
          <Route path="profile" element={<TMAProfile />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
