import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getMyCourses, getTeacherDetailedStats } from '../../store/Slice/courseSlice';
import { getTeacherStats } from '../../store/Slice/submissionSlice';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import NavbarWithDrawer from '../../Components/NavDrawer';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { 
  Users, 
  BookOpen, 
  Play, 
  TrendingUp, 
  Plus, 
  Bell, 
  Calendar, 
  FileText, 
  ChevronRight,
  Clock,
  CheckCircle2,
  MoreVertical,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';

const TeacherHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { courses, detailedStats, loading: coursesLoading } = useSelector((state) => state.courses);
  const { teacherStats } = useSelector((state) => state.submissions);
  const { user } = useSelector((state) => state.auth);

  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    dispatch(getMyCourses());
    dispatch(getTeacherStats());
    dispatch(getTeacherDetailedStats());
  }, [dispatch]);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        if (user?.token) {
          const res = await axios.get(`${API_BASE_URL}/courses/teacher/recent-activity`, {
            headers: { 'x-auth-token': user.token }
          });
          setRecentActivities(res.data);
        }
      } catch (err) {
        console.error("So'nggi faoliyatni yuklashda xatolik:", err);
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchRecentActivities();
  }, [user?.token]);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Hozirgina";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} daqiqa oldin`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} soat oldin`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Kecha";
    return new Date(date).toLocaleDateString('uz-UZ');
  };

  const totalStudents = courses.reduce((acc, course) => acc + (course.students?.length || 0), 0);

  return (
    <NavbarWithDrawer>
      <div className="p-4 lg:p-8 space-y-8 bg-background min-h-screen">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Xush kelibsiz, <span className="text-primary">{user?.name || "O'qituvchi"}</span>!
            </h1>
            <p className="text-muted-foreground mt-1">Bugungi o'quv jarayonlari qisqacha</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/lessons/add">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Yangi dars qo'shish
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            { label: "Jami talabalar", value: totalStudents, icon: Users, color: "bg-blue-500/10 text-blue-600", trend: "+12 bu hafta" },
            { label: "Faol darslar", value: courses.length, icon: Play, color: "bg-emerald-500/10 text-emerald-600", trend: "4 ta yangi" },
            { label: "O'rtacha progress", value: `${teacherStats?.averageMastery || 0}%`, icon: TrendingUp, color: "bg-amber-500/10 text-amber-600", trend: "+5% oshdi" },
            { label: "Topshiriqlar", value: "15", icon: FileText, color: "bg-purple-500/10 text-purple-600", trend: "Kutilayotgan" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-bold border-muted-foreground/20">
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Courses List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Mening kurslarim</h2>
              <Link to="/courses" className="text-sm text-primary font-semibold hover:underline">Barchasi</Link>
            </div>

            <div className="grid gap-4">
              {coursesLoading ? (
                <div className="h-64 bg-muted/50 rounded-2xl animate-pulse" />
              ) : detailedStats?.length > 0 ? (
                detailedStats.map((course) => (
                  <div key={course._id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/50 transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-lg shadow-primary/10">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
                            <Users className="w-4 h-4" />
                            {course.studentCount} talaba
                          </span>
                          <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            {course.averageMastery}% o'zlashtirish
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="hover:text-primary hover:bg-primary/5">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="hover:text-amber-500 hover:bg-amber-500/5">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <span>O'rtacha o'zlashtirish</span>
                        <span className="text-primary">{course.averageMastery}%</span>
                      </div>
                      <Progress value={course.averageMastery} className="h-2" />
                    </div>

                    <Button 
                      className="w-full mt-6 bg-secondary text-foreground hover:bg-primary hover:text-white border-0"
                      onClick={() => navigate(`/courses/${course._id}`)}
                    >
                      Batafsil ma'lumot
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-2xl">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground font-medium">Hozircha kurslar yo'q</p>
                  <Button className="mt-4" onClick={() => navigate('/lessons/add')}>Kurs yaratish</Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">So'nggi faoliyat</h2>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">{recentActivities.length}</Badge>
              </div>

              <div className="space-y-6">
                {activitiesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />)}
                  </div>
                ) : recentActivities.length > 0 ? (
                  recentActivities.map((act) => (
                    <div key={act.id} className="flex gap-4 group">
                      <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-sm font-bold shadow-sm ${
                        act.type === 'submission' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {act.type === 'submission' ? <FileText className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{act.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{act.detail}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-2 font-medium">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(act.date)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-sm text-muted-foreground">Faoliyatlar yo'q</p>
                  </div>
                )}
              </div>

              <Button variant="outline" className="w-full mt-6">
                Barcha faoliyatni ko'rish
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white shadow-xl shadow-primary/20">
              <h3 className="font-bold text-lg mb-4">Tezkor amallar</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 h-20 flex-col gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-[10px]">Talabalar</span>
                </Button>
                <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 h-20 flex-col gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-[10px]">Jadval</span>
                </Button>
                <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 h-20 flex-col gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-[10px]">Hisobot</span>
                </Button>
                <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0 h-20 flex-col gap-2">
                  <Bell className="w-5 h-5" />
                  <span className="text-[10px]">E'lon</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavbarWithDrawer>
  );
};

export default TeacherHome;
