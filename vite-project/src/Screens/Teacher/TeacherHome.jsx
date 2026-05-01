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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
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
  Trash2,
  LayoutGrid,
  Activity,
  GraduationCap
} from 'lucide-react';

const TeacherHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { courses, detailedStats, loading: coursesLoading } = useSelector((state) => state.courses);
  const { teacherStats } = useSelector((state) => state.submissions);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

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

  const totalStudents = detailedStats?.reduce((acc, course) => acc + (course.studentCount || 0), 0) || 0;

  return (
    <NavbarWithDrawer>
      <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
              O'qituvchi <span className="text-primary">paneli</span>
            </h1>
            <p className="text-muted-foreground font-medium">Xush kelibsiz, {user?.name || "O'qituvchi"}. Bugungi ko'rsatkichlaringiz.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/lessons/add">
              <Button className="rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-bold px-6 h-12">
                <Plus className="w-5 h-5 mr-2" />
                Yangi dars qo'shish
              </Button>
            </Link>
          </div>
        </header>

        <div className="space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                label: "Jami talabalar", 
                value: totalStudents || 0, 
                icon: Users, 
                color: "from-blue-500 to-indigo-600", 
                trend: `+${detailedStats?.reduce((acc, c) => acc + (c.newStudents || 0), 0) || 0} yangi` 
              },
              { 
                label: "Faol kurslar", 
                value: detailedStats?.length || 0, 
                icon: BookOpen, 
                color: "from-emerald-500 to-teal-600", 
                trend: `${detailedStats?.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length || 0} ta yangi` 
              },
              { 
                label: "O'rtacha o'zlashtirish", 
                value: `${teacherStats?.averageMastery || 0}%`, 
                icon: TrendingUp, 
                color: "from-amber-500 to-orange-600", 
                trend: "O'rtacha ko'rsatkich" 
              },
              { 
                label: "Topshiriqlar", 
                value: detailedStats?.reduce((acc, c) => acc + (c.pendingSubmissions || 0), 0) || 0, 
                icon: FileText, 
                color: "from-purple-500 to-fuchsia-600", 
                trend: "Kutilayotgan" 
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card border border-border p-6 rounded-[2.5rem] shadow-sm relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 -translate-y-16 translate-x-16 rounded-full group-hover:scale-110 transition-transform duration-500`} />
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-primary/10`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold border-border/50">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-foreground tracking-tight">{stat.value}</h3>
                  <p className="text-sm font-bold text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* Courses List - Quick View */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Mening kurslarim
                  </h2>
                  <Link to="/courses" className="text-sm text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors">
                    Barchasi <ChevronRight className="w-4 h-4 ml-1 inline" />
                  </Link>
                </div>

                <div className="grid gap-4">
                  {coursesLoading ? (
                    <div className="h-40 bg-muted/50 rounded-[2.5rem] animate-pulse" />
                  ) : detailedStats?.length > 0 ? (
                    detailedStats.slice(0, 3).map((course) => (
                      <div key={course._id} className="bg-white border border-border rounded-[2.5rem] p-6 hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                            <BookOpen className="w-8 h-8 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-black text-xl text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                              <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                <Users className="w-3.5 h-3.5" />
                                {course.studentCount} talaba
                              </span>
                              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                <TrendingUp className="w-3.5 h-3.5" />
                                {course.averageMastery}% o'zlashtirish
                              </span>
                            </div>
                          </div>
                          <Button 
                            className="rounded-2xl font-bold bg-secondary hover:bg-primary hover:text-white transition-all px-8 h-12"
                            onClick={() => navigate(`/courses/${course._id}`)}
                          >
                            Boshqarish
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white border border-dashed border-border rounded-[2.5rem] space-y-4">
                      <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <p className="font-bold text-muted-foreground">Hozircha kurslar yo'q</p>
                      <Button className="rounded-2xl font-bold" onClick={() => navigate('/lessons/add')}>Kurs yaratish</Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Monitoring Section */}
              <div className="space-y-6 pt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-emerald-500" />
                    Sinflar monitoringi
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {detailedStats?.map((course) => (
                    <motion.div key={course._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <Card className="rounded-[2.5rem] border-border overflow-hidden hover:shadow-2xl transition-all group bg-white h-full flex flex-col border-none shadow-sm">
                        <CardHeader className="p-6 pb-2">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                              <GraduationCap className="w-6 h-6" />
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black px-3 py-1 rounded-lg text-[10px]">Sinf</Badge>
                          </div>
                          <CardTitle className="text-lg font-black text-foreground group-hover:text-emerald-600 transition-colors line-clamp-1 leading-tight">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Talabalar</p>
                              <p className="text-lg font-black text-foreground flex items-center gap-1">
                                <Users className="w-4 h-4 text-emerald-500" />
                                {course.studentCount}
                              </p>
                            </div>
                            <div className="space-y-1 text-right">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Darslar</p>
                              <p className="text-lg font-black text-emerald-600">{course.totalLessons}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                                O'zlashtirish
                              </span>
                              <span className="text-sm font-black text-emerald-700">{course.averageMastery}%</span>
                            </div>
                            <Progress value={course.averageMastery} className="h-1.5 bg-emerald-100/50" />
                          </div>

                          <Button 
                            className="w-full rounded-xl font-black text-xs h-10 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 group/btn mt-2"
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsCourseModalOpen(true);
                            }}
                          >
                            Monitoring
                            <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Recent Activity */}
            <div className="space-y-6">
              <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-foreground">Faoliyat</h2>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0 rounded-lg px-3 py-1 font-black">
                    {recentActivities.length}
                  </Badge>
                </div>

                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {activitiesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-muted/50 rounded-2xl animate-pulse" />)}
                    </div>
                  ) : recentActivities.length > 0 ? (
                    recentActivities.map((act) => (
                      <div key={act.id} className="flex gap-4 group cursor-pointer">
                        <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-sm font-bold shadow-sm transition-transform group-hover:scale-110 ${
                          act.type === 'submission' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {act.type === 'submission' ? <FileText className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">{act.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 font-medium">{act.detail}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-2 font-black uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(act.date)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 space-y-4 opacity-50">
                      <Activity className="w-10 h-10 mx-auto text-muted-foreground" />
                      <p className="text-sm font-bold text-muted-foreground">Faoliyatlar yo'q</p>
                    </div>
                  )}
                </div>

                <Button variant="ghost" className="w-full mt-8 rounded-2xl font-black text-xs uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 py-6">
                  Barchasini ko'rish
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Modals */}
      <DetailModal 
        isOpen={isCourseModalOpen} 
        setIsOpen={setIsCourseModalOpen} 
        title={selectedCourse?.title}
        studentDetails={selectedCourse?.studentDetails}
        type="course"
      />
    </NavbarWithDrawer>
  );
};

const DetailModal = ({ isOpen, setIsOpen, title, studentDetails, type }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-10 border-b border-border flex items-center justify-between bg-muted/5">
          <div>
            <h2 className="text-3xl font-black text-foreground tracking-tight">{title}</h2>
            <p className="text-sm font-bold text-muted-foreground mt-1">O'quvchilar natijalari va faolligi monitoringi</p>
          </div>
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-full w-12 h-12 p-0 hover:bg-red-50 hover:text-red-500 transition-colors">
            <Plus className="w-6 h-6 rotate-45" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {!studentDetails || studentDetails.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto text-muted-foreground/50">
                <Users className="w-10 h-10" />
              </div>
              <p className="font-black text-xl text-muted-foreground/50 tracking-tight">Hali hech qanday o'quvchi ma'lumoti yo'q</p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Jami o'quvchilar</p>
                  <p className="text-4xl font-black text-indigo-700">{studentDetails.length}</p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-emerald-50/50 border border-emerald-100 flex flex-col items-center justify-center shadow-sm">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">O'rtacha natija</p>
                  <p className="text-4xl font-black text-emerald-700">
                    {Math.round(studentDetails.reduce((acc, s) => acc + (type === 'lesson' ? (s.quizScore || 0) : s.overall), 0) / studentDetails.length)}%
                  </p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-amber-50/50 border border-amber-100 flex flex-col items-center justify-center shadow-sm">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Faoliyat</p>
                  <p className="text-4xl font-black text-amber-700">{Math.round(studentDetails.filter(s => (type === 'lesson' ? s.quizScore !== null : s.progress > 0)).length / studentDetails.length * 100)}%</p>
                </div>
              </div>

              <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <th className="px-8 py-5">O'quvchi</th>
                        <th className="px-8 py-5 text-center">Progress</th>
                        <th className="px-8 py-5 text-center">Quiz O'rtacha</th>
                        <th className="px-8 py-5 text-center">Topshiriqlar</th>
                        <th className="px-8 py-5 text-center">Umumiy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {studentDetails.map((student) => (
                        <tr key={student._id} className="hover:bg-muted/5 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-lg">
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-black text-base text-foreground">{student.name}</p>
                                <p className="text-xs text-muted-foreground font-bold">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col items-center gap-1.5">
                              <span className="text-xs font-black">{student.progress}%</span>
                              <Progress value={student.progress} className="h-1.5 w-16 bg-muted" />
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center text-sm font-black text-indigo-600">{student.avgQuiz}%</td>
                          <td className="px-8 py-5 text-center text-sm font-black text-emerald-600">{student.avgAssignment}%</td>
                          <td className="px-8 py-5 text-center">
                            <Badge className="bg-primary/10 text-primary border-none font-black px-3 py-1 rounded-lg">
                              {student.overall}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-10 border-t border-border bg-muted/5 flex justify-end">
          <Button onClick={() => setIsOpen(false)} className="rounded-[1.5rem] font-black px-10 h-14 text-sm shadow-xl hover:shadow-2xl transition-all">Yopish</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherHome;
