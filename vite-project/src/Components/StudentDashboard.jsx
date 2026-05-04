import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { getMyCourses, getStudentStats, getStudentProgress, getOfficialCourses } from '../store/Slice/courseSlice';
import NavbarWithDrawer from './NavDrawer';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { 
  Clock, 
  Play, 
  CheckCircle2, 
  Target, 
  Flame, 
  Boxes, 
  FileText, 
  ChevronRight,
  Sparkles,
  Trophy,
  BookOpen,
  TrendingUp,
  Zap,
  ArrowRight,
  Bell,
  MessageCircle,
  X,
  Send,
  Brain,
  Users
} from 'lucide-react';

const StudentDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses, officialCourses, studentStats, studentProgress } = useSelector((state) => state.courses);
  const token = user?.token;

  const [loading, setLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'model', parts: [{ text: "Assalomu alaykum! Men sizning AI tyutoringizman. Qanday yordam bera olaman?" }] }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        setLoading(true);
        await Promise.all([
          dispatch(getMyCourses()),
          dispatch(getOfficialCourses()),
          dispatch(getStudentStats()),
          dispatch(getStudentProgress())
        ]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Real-time Study Tracker (1 minute interval)
    const trackerInterval = setInterval(async () => {
        try {
            await axios.put(`${API_BASE_URL}/auth/tracker`, { timeToAdd: 60 }, {
                headers: { 'x-auth-token': token }
            });
            // Update local state quietly
            dispatch(getStudentStats());
        } catch (err) {
            console.error("Tracker update error:", err);
        }
    }, 60000);

    return () => clearInterval(trackerInterval);
  }, [token, dispatch]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleContinue = () => {
    // 1. Prioritize last lesson from Admin/Official courses (Handled by backend now)
    if (studentStats?.lastLesson?._id) {
      navigate(`/lessons/${studentStats.lastLesson._id}`);
      return;
    }

    // 2. Fallback: Find the first lesson of the first OFFICIAL course (using new state)
    if (officialCourses && officialCourses.length > 0 && officialCourses[0].lessons?.length > 0) {
      navigate(`/lessons/${officialCourses[0].lessons[0]._id}`);
      return;
    }

    // 3. Last fallback: General lessons page
    navigate('/lessons');
  };

  const handleAiChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = { role: 'user', parts: [{ text: chatInput }] };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/ai/chat`, {
        contents: [...chatMessages, userMessage],
        systemContext: "Siz MultiEdu platformasining aqlli AI tyutorisiz. Talabalarga darslarni o'zlashtirishda yordam berasiz. Javoblaringiz qisqa, aniq va motivatsion bo'lishi kerak. O'zbek tilida gapiring."
      }, {
        headers: { 'x-auth-token': token }
      });

      const aiMessage = res.data.candidates[0].content;
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI Chat error:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const getThumbnail = (item) => {
    if (item.thumbnailUrl && item.thumbnailUrl !== 'no-image') return item.thumbnailUrl;
    if (item.thumbnail && item.thumbnail !== 'no-image') return item.thumbnail;
    return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400';
  };

  // Calculate some aggregate stats from progress
  const totalLessonsViewed = studentProgress.reduce((acc, p) => acc + (p.viewedLessonsCount || 0), 0);
  const avgGrade = studentProgress.length > 0 
    ? Math.round(studentProgress.reduce((acc, p) => acc + (p.averageGrade || 0), 0) / studentProgress.length)
    : 0;

  return (
    <>
      <NavbarWithDrawer>
      <div className="bg-[#fcfdff] min-h-screen pb-24 font-sans selection:bg-primary/20">
        {/* Premium Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] -left-[5%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px]" />
        </div>

        <main className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-6 space-y-10 relative z-10">
          
          {/* Ultra-Premium Hero Greeting */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] bg-[#0f172a] p-8 lg:p-12 text-white shadow-2xl shadow-indigo-500/10"
          >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary/20 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
              <div className="space-y-6 max-w-2xl">
                <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1.5 rounded-full font-black text-[9px] tracking-[0.3em] backdrop-blur-md uppercase">
                  Oʻquvchi boshqaruvi
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                  Xush kelibsiz, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-white">
                    {user?.name || 'Talaba'}!
                  </span>
                </h1>
                <div className="flex flex-wrap gap-8 pt-2">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Progress</span>
                      <span className="text-xl font-black">{avgGrade}% oʻrtacha ball</span>
                   </div>
                   <div className="w-[1px] h-10 bg-white/10 hidden sm:block" />
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Darslar</span>
                      <span className="text-xl font-black">{totalLessonsViewed} ta o'rganildi</span>
                   </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 w-full lg:w-auto">
                <Button 
                  onClick={handleContinue}
                  className="h-16 px-10 rounded-[1.5rem] bg-white text-[#0f172a] hover:bg-primary hover:text-white font-black text-base gap-3 shadow-xl transition-all duration-500 group"
                >
                  Oʻqishni davom ettirish
                  <Play className="w-5 h-5 fill-current group-hover:scale-125 transition-transform" />
                </Button>
                <div className="flex gap-3">
                   <Button variant="outline" className="flex-1 h-12 rounded-[1rem] bg-white/5 border-white/10 text-white hover:bg-white hover:text-primary font-black text-xs backdrop-blur-md">
                     Sertifikatlar
                   </Button>
                   <Button variant="outline" className="flex-1 h-12 rounded-[1rem] bg-white/5 border-white/10 text-white hover:bg-white hover:text-primary font-black text-xs backdrop-blur-md">
                     Yutuqlar
                   </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* New Horizontal Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Tugallangan kurslar', value: studentProgress.filter(p => p.overallPercentage >= 100).length, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'Darslar ko\'rildi', value: totalLessonsViewed, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'O\'rtacha ball', value: `${avgGrade}%`, icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50' },
              { 
                label: 'O\'quv vaqti', 
                value: studentStats?.timeSpent > 3600 
                  ? `${Math.floor(studentStats.timeSpent / 3600)}s ${Math.floor((studentStats.timeSpent % 3600) / 60)}d`
                  : `${Math.floor((studentStats?.timeSpent || 0) / 60)} daqiqa`, 
                icon: Zap, 
                color: 'text-emerald-500',
                bg: 'bg-emerald-50'
              },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex items-center gap-8 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-[#1e293b] tracking-tight">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Main Content */}
            <div className="lg:col-span-2 space-y-16">
              
              {/* Continue Learning Section - Cinematic */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#0f172a] font-black text-2xl px-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Play className="w-5 h-5 text-primary fill-primary" />
                  </div>
                  <span>Oʻqishni davom ettiring</span>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-[#1e293b] border border-slate-800 rounded-[3.5rem] p-10 lg:p-14 text-white overflow-hidden shadow-2xl shadow-slate-900/20 group"
                >
                  <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none bg-gradient-to-l from-primary/40 to-transparent" />
                  <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px]" />
 
                   <div className="relative z-10 space-y-10">
                    <Badge className="bg-primary hover:bg-primary text-white border-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                      FAOL DARSLIK
                    </Badge>
                    
                    <div className="space-y-4">
                      <h2 className="text-4xl lg:text-6xl font-black leading-[1.1] max-w-[90%] tracking-tight">
                        {studentStats?.lastLesson?.title || "Hali dars boshlanmagan"}
                      </h2>
                      <div className="flex flex-wrap items-center gap-8 text-slate-400 text-lg font-bold">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-primary" />
                          <span>12 minut qoldi</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-primary" />
                          <span>4-modul, 2-dars</span>
                        </div>
                      </div>
                    </div>
 
                    <div className="space-y-6 max-w-xl">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                        <span>JAMI PROGRESS</span>
                        <span className="text-primary">{studentStats?.lastLesson ? 
                          `${studentProgress.find(p => p.courseId === studentStats.lastLesson.course)?.overallPercentage || 0}%` : 
                          '0%'}</span>
                      </div>
                      <div className="h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${studentStats?.lastLesson ? 
                            (studentProgress.find(p => p.courseId === studentStats.lastLesson.course)?.overallPercentage || 0) : 0}%` }}
                          className="h-full bg-gradient-to-r from-primary to-indigo-400 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)]" 
                        />
                      </div>
                    </div>
 
                    <Button 
                      className="bg-primary text-white hover:bg-white hover:text-primary rounded-[1.5rem] px-12 h-16 font-black text-lg gap-3 shadow-2xl shadow-primary/20 transition-all duration-500 transform group-hover:scale-105"
                      onClick={handleContinue}
                    >
                      Darsni davom ettirish
                      <Play className="w-5 h-5 fill-current" />
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* My Courses Section */}
              <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-4 text-[#0f172a] font-black text-3xl">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Boxes className="w-7 h-7" />
                    </div>
                    <span>Sinflar</span>
                  </div>
                  <Button variant="ghost" onClick={() => navigate('/courses')} className="text-primary font-black text-sm gap-2 hover:bg-primary/5 rounded-xl px-5">
                    Barcha kurslar <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {courses.length > 0 ? courses.slice(0, 4).map((course, i) => {
                    const progress = studentProgress.find(p => p.courseId === course._id);
                    return (
                      <motion.div 
                        key={course._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group flex flex-col"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img 
                            src={getThumbnail(course)} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            alt="" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                          <Badge className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-primary border-none font-black text-[10px] px-5 py-2 rounded-full shadow-xl">
                            {course.category || 'AKADEMIK'}
                          </Badge>
                          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                             <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                               <Users className="w-4 h-4 text-primary" />
                               <span>{course.enrolledStudents?.length || 0} Talaba</span>
                             </div>
                             <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm shadow-xl">
                               <Play className="w-4 h-4 fill-white" />
                             </div>
                          </div>
                        </div>
                        
                        <div className="p-10 flex-1 flex flex-col space-y-8">
                          <h4 className="font-black text-[#0f172a] text-2xl leading-tight line-clamp-2 min-h-[4rem]">
                            {course.title}
                          </h4>
                          
                          <div className="space-y-5">
                            <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <span>{course.lessons?.length || 0} MAVZU</span>
                              </div>
                              <span className="text-primary">{progress?.overallPercentage || 0}%</span>
                            </div>
                            <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress?.overallPercentage || 0}%` }}
                                className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full shadow-lg" 
                              />
                            </div>
                          </div>
 
                          <Button 
                            className="w-full rounded-[1.25rem] bg-slate-50 hover:bg-primary hover:text-white border-none text-[#0f172a] font-black text-sm h-16 transition-all duration-300 gap-2"
                            onClick={() => navigate(`/courses/${course._id}`)}
                          >
                            Darsni ko'rish
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  }) : (
                    <div className="col-span-full py-32 text-center space-y-8 bg-white border-2 border-dashed border-slate-100 rounded-[4rem]">
                      <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto shadow-inner text-slate-300">
                        <Boxes className="w-12 h-12" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-[#0f172a] font-black text-2xl">Kurslar hali mavjud emas</p>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto text-lg">Siz hali birorta kursga qo'shilmagansiz. Hozirgi kurslarni ko'rib chiqing va o'rganishni boshlang.</p>
                      </div>
                      <Button onClick={() => navigate('/courses')} className="rounded-2xl px-12 h-14 bg-primary font-black text-base shadow-xl shadow-primary/20">
                        Kurslarni ko'rish
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
 
            {/* Right Sidebar */}
            <div className="space-y-10">
              <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="font-black text-[#0f172a] text-2xl tracking-tight">So'nggi harakatlar</h3>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
 
                <div className="space-y-12">
                  {studentProgress.length > 0 ? studentProgress.slice(0, 4).map((prog, i) => (
                    <div key={i} className="flex gap-6 relative group cursor-pointer">
                      {i !== 3 && <div className="absolute left-[27px] top-16 w-[2px] h-12 bg-slate-50 group-hover:bg-primary/20 transition-colors" />}
                      <div className={`w-14 h-14 rounded-2xl ${i % 2 === 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'} flex items-center justify-center shrink-0 shadow-sm z-10 border-4 border-white transition-transform group-hover:scale-110`}>
                        {i % 2 === 0 ? <CheckCircle2 className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 space-y-2 pt-1">
                        <h4 className="text-base font-black text-[#1e293b] leading-tight group-hover:text-primary transition-colors">
                          "{prog.courseTitle}"
                        </h4>
                        <div className="flex items-center gap-3">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{prog.overallPercentage}% yakunlandi</p>
                           <div className="w-1 h-1 rounded-full bg-slate-300" />
                           <p className="text-[10px] font-black text-primary uppercase">2 soat avval</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-16 space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto opacity-50 text-slate-300">
                        <TrendingUp className="w-8 h-8" />
                      </div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Harakatlar yo'q</p>
                    </div>
                  )}
                </div>
 
                {/* Upgrade/Promo Card */}
                <div className="mt-16 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-4">
                   <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto -mt-14 border border-slate-100">
                      <Sparkles className="w-6 h-6 text-primary" />
                   </div>
                   <h4 className="font-black text-[#0f172a]">MultiEdu Academy</h4>
                   <p className="text-xs font-medium text-slate-500">Eng so'nggi bilimlar va yangiliklardan doimiy boxabar bo'ling.</p>
                   <Button variant="outline" className="w-full rounded-xl font-black text-[10px] uppercase tracking-widest border-2">Batafsil</Button>
                </div>
              </div>
 
              {/* AI Assistant Widget - Large & Floating Effect */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#4f46e5] rounded-[3rem] p-10 text-white space-y-8 shadow-2xl shadow-primary/40 relative overflow-hidden group cursor-pointer"
                onClick={() => setIsAiModalOpen(true)}
              >
                
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl border border-white/30 group-hover:rotate-12 transition-transform duration-500">
                  <Sparkles className="w-9 h-9 text-white" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl font-black tracking-tight">AI Tyutor</h3>
                  <p className="text-white/80 text-base font-bold leading-relaxed">
                    Tushunmagan savollaringizni, istalgan vaqtda AI yordamchidan so'rang. 24/7 siz bilan birga.
                  </p>
                </div>
                
                <Button className="w-full bg-white text-primary hover:bg-slate-100 rounded-2xl h-16 font-black text-lg gap-3 shadow-2xl shadow-black/20">
                  Suhbatni boshlash
                  <MessageCircle className="w-6 h-6" />
                </Button>
              </motion.div>
            </div>
          </div>
        </main>
 
        <div className="pt-24 pb-12 text-center">
          <p className="text-[#94a3b8] text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
            © 2026 MultiEdu Premium EdTech • Bilim platformasi
          </p>
        </div>
      </div>

        {/* AI Tutor Modal */}
        <AnimatePresence>
          {isAiModalOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm"
                onClick={() => setIsAiModalOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[600px]"
              >
                {/* Header */}
                <div className="p-6 bg-primary text-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg">MultiEdu AI Tyutor</h3>
                      <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Onlayn • SIZGA YORDAM BERISHGA TAYYOR</p>
                    </div>
                  </div>
                  <IconButton onClick={() => setIsAiModalOpen(false)} sx={{ color: 'white' }}>
                    <X />
                  </IconButton>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8fafc]">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl font-bold text-sm shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-white text-[#1e293b] border border-[#f1f5f9] rounded-tl-none'
                      }`}>
                        {msg.parts[0].text}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-[#f1f5f9] p-4 rounded-2xl rounded-tl-none">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleAiChat} className="p-6 bg-white border-t border-[#f1f5f9] flex gap-4">
                  <input 
                    className="flex-1 bg-[#f8fafc] border-2 border-[#f1f5f9] focus:border-primary rounded-2xl px-6 outline-none font-bold text-sm transition-all"
                    placeholder="Savolingizni yozing..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <Button type="submit" disabled={isChatLoading} className="w-14 h-14 rounded-2xl bg-primary hover:bg-primary/90 p-0 shadow-lg shadow-primary/20">
                    <Send className="w-6 h-6" />
                  </Button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </NavbarWithDrawer>
    </>
  );
};

export default StudentDashboard;
