import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { getMyCourses, getStudentStats, getStudentProgress } from '../store/Slice/courseSlice';
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
  Send
} from 'lucide-react';

const StudentDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses, studentStats, studentProgress } = useSelector((state) => state.courses);
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
    if (studentStats?.lastLesson) {
      navigate(`/lessons/${studentStats.lastLesson._id}`);
    } else if (courses.length > 0 && courses[0].lessons?.length > 0) {
        navigate(`/lessons/${courses[0].lessons[0]._id}`);
    } else {
      navigate('/courses');
    }
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
    <NavbarWithDrawer>
      <div className="bg-white min-h-screen pb-20 font-sans">
        <main className="max-w-[1440px] mx-auto px-6 pt-6 space-y-8">
          
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-[#1e293b] tracking-tight">
                Xush kelibsiz, {user?.name || 'Talaba'}! 👋
              </h1>
              <p className="text-[#64748b] font-medium">
                Bugun yangi narsalarni o'rganish uchun ajoyib kun. Progressingizni davom ettiring!
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Tugallangan kurslar', value: studentProgress.filter(p => p.overallPercentage >= 100).length, icon: Trophy, color: 'bg-[#fef3c7] text-[#d97706]' },
              { label: 'Darslar ko\'rildi', value: totalLessonsViewed, icon: BookOpen, color: 'bg-[#e0f2fe] text-[#0284c7]' },
              { label: 'O\'rtacha ball', value: `${avgGrade}%`, icon: TrendingUp, color: 'bg-[#f3e8ff] text-[#7c3aed]' },
              { 
                label: 'O\'quv vaqti', 
                value: studentStats?.timeSpent > 3600 
                  ? `${Math.floor(studentStats.timeSpent / 3600)}s ${Math.floor((studentStats.timeSpent % 3600) / 60)}d`
                  : `${Math.floor((studentStats?.timeSpent || 0) / 60)} daqiqa`, 
                icon: Zap, 
                color: 'bg-[#dcfce7] text-[#16a34a]' 
              },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-[#f1f5f9] rounded-2xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center shadow-inner`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <p className="text-xl font-black text-[#1e293b] tracking-tight">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Main Content */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Continue Learning Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#1e293b] font-black text-lg ml-2">
                  <Clock className="w-5 h-5 text-[#7c3aed]" />
                  <span>O'qishni davom ettiring</span>
                </div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="relative bg-[#f5f3ff] border border-[#e9e4ff] rounded-[2.5rem] p-8 text-[#1e293b] overflow-hidden shadow-sm"
                >
                  <div className="absolute top-0 right-0 w-[40%] h-full opacity-5 pointer-events-none">
                    <Zap className="w-full h-full fill-primary" />
                  </div>
 
                   <div className="relative z-10 space-y-6">
                    <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Oxirgi ko'rilgan dars
                    </Badge>
                    
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black leading-tight max-w-[85%] tracking-tight text-[#1e293b]">
                        {studentStats?.lastLesson?.title || "Hali dars boshlanmagan"}
                      </h2>
                      <div className="flex items-center gap-6 text-[#64748b] text-sm font-bold">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>12 minut qoldi</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span>4-modul, 2-dars</span>
                        </div>
                      </div>
                    </div>
 
                    <div className="space-y-4 max-w-md">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">
                        <span>Jami progress: {studentStats?.lastLesson ? 
                          `${studentProgress.find(p => p.courseId === studentStats.lastLesson.course)?.overallPercentage || 0}%` : 
                          '0%'}</span>
                      </div>
                      <div className="h-2.5 bg-[#e9e4ff] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${studentStats?.lastLesson ? 
                            (studentProgress.find(p => p.courseId === studentStats.lastLesson.course)?.overallPercentage || 0) : 0}%` }}
                          className="h-full bg-primary rounded-full" 
                        />
                      </div>
                    </div>
 
                    <Button 
                      className="bg-primary text-white hover:bg-primary/90 rounded-2xl px-10 h-14 font-black text-base gap-2 shadow-xl shadow-primary/20 transition-all"
                      onClick={handleContinue}
                    >
                      Darsni davom ettirish
                      <Play className="w-4 h-4 fill-white" />
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* My Courses Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between ml-2">
                  <div className="flex items-center gap-2 text-[#1e293b] font-black text-xl">
                    <Boxes className="w-6 h-6 text-[#7c3aed]" />
                    <span>Sinflar</span>
                  </div>
                  <Button variant="ghost" onClick={() => navigate('/courses')} className="text-primary font-black text-sm gap-1 hover:bg-primary/5">
                    Hammasini ko'rish <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {courses.length > 0 ? courses.slice(0, 4).map((course, i) => {
                    const progress = studentProgress.find(p => p.courseId === course._id);
                    return (
                      <motion.div 
                        key={course._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-[#f1f5f9] rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img 
                            src={getThumbnail(course)} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                            alt="" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Badge className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-primary border-none font-black text-[10px] px-4 py-1.5 rounded-full shadow-lg">
                            {course.category || 'AKADEMIK'}
                          </Badge>
                        </div>
                        
                        <div className="p-8 flex-1 flex flex-col space-y-6">
                          <h4 className="font-black text-[#1e293b] text-xl leading-tight line-clamp-2">
                            {course.title}
                          </h4>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between text-xs font-black text-[#94a3b8] uppercase tracking-[0.1em]">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <span>{course.lessons?.length || 0} mavzu</span>
                              </div>
                              <span className="text-primary">{progress?.overallPercentage || 0}%</span>
                            </div>
                            <div className="h-2 bg-[#f8fafc] rounded-full overflow-hidden border border-[#f1f5f9]">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress?.overallPercentage || 0}%` }}
                                className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(124,58,237,0.4)]" 
                              />
                            </div>
                          </div>

                          <Button 
                            className="w-full rounded-2xl bg-[#f8fafc] hover:bg-primary hover:text-white border-2 border-transparent text-[#1e293b] font-black text-sm h-14 transition-all gap-2"
                            onClick={() => navigate(`/courses/${course._id}`)}
                          >
                            Darsni davom ettirish
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  }) : (
                    <div className="col-span-full py-24 text-center space-y-6 bg-white border-2 border-dashed border-[#f1f5f9] rounded-[3rem]">
                      <div className="w-20 h-20 bg-[#f8fafc] rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                        <Boxes className="w-10 h-10 text-[#cbd5e1]" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[#1e293b] font-black text-xl">Kurslar hali yo'q</p>
                        <p className="text-[#64748b] font-medium max-w-xs mx-auto">Siz hali birorta kursga qo'shilmagansiz. Hozirgi kurslarni ko'rib chiqing.</p>
                      </div>
                      <Button onClick={() => navigate('/courses')} className="rounded-2xl px-10 h-12 bg-primary font-black">
                        Kurslarni ko'rish
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              <div className="bg-white border border-[#f1f5f9] rounded-[3rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="font-black text-[#1e293b] text-xl tracking-tight">So'nggi harakatlar</h3>
                  <Badge variant="secondary" className="bg-[#f8fafc] text-[#94a3b8] border-none font-bold">Hammasi</Badge>
                </div>

                <div className="space-y-10">
                  {studentProgress.length > 0 ? studentProgress.slice(0, 4).map((prog, i) => (
                    <div key={i} className="flex gap-5 relative">
                      {i !== 3 && <div className="absolute left-[23px] top-12 w-[2px] h-10 bg-[#f8fafc]" />}
                      <div className={`w-12 h-12 rounded-2xl ${i % 2 === 0 ? 'bg-[#f0fdf4] text-[#10b981]' : 'bg-[#eff6ff] text-[#3b82f6]'} flex items-center justify-center shrink-0 shadow-sm z-10 border border-white`}>
                        {i % 2 === 0 ? <CheckCircle2 className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-black text-[#334155] leading-tight">
                          "{prog.courseTitle}" kursi o'rganilmoqda
                        </h4>
                        <p className="text-[11px] font-black text-[#94a3b8] uppercase tracking-wider">{prog.overallPercentage}% yakunlandi</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-10 space-y-3">
                      <Clock className="w-10 h-10 text-[#cbd5e1] mx-auto opacity-50" />
                      <p className="text-xs font-black text-[#94a3b8] uppercase">Harakatlar yo'q</p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Assistant Widget */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] rounded-[2.5rem] p-7 text-white space-y-6 shadow-xl shadow-primary/30 relative overflow-hidden group cursor-pointer"
                onClick={() => setIsAiModalOpen(true)}
              >
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-2xl border border-white/20">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black tracking-tight">AI Tutor</h3>
                  <p className="text-white/80 text-[13px] font-bold leading-relaxed">
                    Tushunmagan savollaringizni AI yordamchidan so'rang. 24/7 xizmatingizda.
                  </p>
                </div>
                <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-xl h-11 font-black text-sm gap-2 shadow-xl shadow-black/10">
                  Savol berish
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </main>

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

        <div className="pt-10 pb-4 text-center">
          <p className="text-[#94a3b8] text-[10px] font-black uppercase tracking-[0.2em]">
            © 2026 MultiEdu Premium Learning • Bilim markazi
          </p>
        </div>
      </div>
    </NavbarWithDrawer>
  );
};

export default StudentDashboard;
