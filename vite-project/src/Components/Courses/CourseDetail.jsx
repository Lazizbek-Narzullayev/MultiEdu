import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Settings, 
  Users, 
  GraduationCap, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  Lock, 
  ChevronRight,
  MoreVertical,
  Calendar,
  Share2,
  Trash2,
  Edit2,
  PlayCircle,
  ClipboardList,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';

import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { API_BASE_URL } from '../../config/apiConfig';
import NavbarWithDrawer from '../NavDrawer';
import LessonForm from '../Multimodal/LessonForm';
import QuizForm from '../Multimodal/QuizForm';
import AssignmentForm from '../Multimodal/AssignmentForm';
import SubmissionModal from '../Multimodal/SubmissionModal';
import GradingModal from '../Multimodal/GradingModal';
import Swal from 'sweetalert2';

import { getCourseById, updateCourse } from '../../store/Slice/courseSlice';
import { getCourseQuizzes, getCourseAllAttempts } from '../../store/Slice/quizSlice';
import { getCourseAssignments } from '../../store/Slice/assignmentSlice';
import { getCourseGrades } from '../../store/Slice/submissionSlice';
import { getCourseAnnouncements, createAnnouncement } from '../../store/Slice/announcementSlice';

const CourseDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCourse, loading } = useSelector((state) => state.courses);
    const { user } = useSelector((state) => state.auth);
    const { quizzes, attempts, allCourseAttempts } = useSelector((state) => state.quizzes);
    const { assignments } = useSelector((state) => state.assignments);
    const { allCourseGrades } = useSelector((state) => state.submissions);
    const { announcements: allAnnouncements } = useSelector((state) => state.announcements);
    const courseAnnouncements = allAnnouncements[id] || [];

    const [activeTab, setActiveTab] = useState("stream");
    const [isAnnouncementExpanded, setIsAnnouncementExpanded] = useState(false);
    const [announcementText, setAnnouncementText] = useState('');
    const [isLessonFormOpen, setIsLessonFormOpen] = useState(false);
    const [isQuizFormOpen, setIsQuizFormOpen] = useState(false);
    const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false);

    useEffect(() => {
        dispatch(getCourseById(id));
        dispatch(getCourseQuizzes(id));
        dispatch(getCourseAssignments(id));
        dispatch(getCourseGrades(id));
        dispatch(getCourseAnnouncements(id));
        if (user?.role === 'teacher' || user?.role === 'super-admin') {
            dispatch(getCourseAllAttempts(id));
        }
    }, [dispatch, id, user?.role]);

    const isTeacher = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'super-admin';
    const isOwner = currentCourse?.teacher?._id === user?._id || currentCourse?.teacher === user?._id;

    const handlePostAnnouncement = async () => {
        if (!announcementText.trim()) return;
        try {
            await dispatch(createAnnouncement({ courseId: id, content: announcementText })).unwrap();
            setAnnouncementText('');
            setIsAnnouncementExpanded(false);
            Swal.fire({ icon: 'success', title: 'E\'lon yuborildi', timer: 1500, showConfirmButton: false });
        } catch (error) {
            Swal.fire('Xato', 'E\'lon yozishda xatolik', 'error');
        }
    };

    if (loading || !currentCourse) {
        return (
            <NavbarWithDrawer>
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </NavbarWithDrawer>
        );
    }

    const feedItems = [
        ...(currentCourse?.lessons?.map(l => ({ ...l, type: 'lesson' })) || []),
        ...(quizzes?.map(q => ({ ...q, type: 'quiz' })) || []),
        ...(assignments?.map(a => ({ ...a, type: 'assignment' })) || []),
        ...(courseAnnouncements?.map(an => ({ ...an, type: 'announcement' })) || [])
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <NavbarWithDrawer>
            <div className="min-h-screen bg-white pb-20">
                {/* Modern Hero Header */}
                <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                    <img 
                        src={currentCourse.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000"} 
                        className="w-full h-full object-cover"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#1e293b]/60 to-transparent" />
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-[1440px] mx-auto w-full">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4 max-w-2xl">
                                <Badge className="bg-primary text-white border-none px-4 py-1.5 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                                    {currentCourse.isOfficial ? "Rasmiy Kurs" : "Sinf xonasi"}
                                </Badge>
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                                    {currentCourse.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-white/90 font-bold">
                                    <div className="flex items-center gap-3">
                                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)' }}>
                                            {currentCourse.teacher?.name?.[0] || 'L'}
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase text-white/60 tracking-wider">O'qituvchi</span>
                                            <span className="text-sm">{currentCourse.teacher?.name || "MultiEdu Academy"}</span>
                                        </div>
                                    </div>
                                    <div className="h-8 w-[1px] bg-white/20 hidden sm:block" />
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary" />
                                        <span>{currentCourse.students?.length || 0} o'quvchi</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-primary" />
                                        <span>{currentCourse.lessons?.length || 0} dars</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                {isOwner && (
                                    <Button variant="outline" className="h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-2xl backdrop-blur-md px-6 font-black">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Sozlamalar
                                    </Button>
                                )}
                                <Button className="h-12 bg-white text-[#1e293b] hover:bg-white/90 rounded-2xl px-10 shadow-2xl shadow-black/20 font-black">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Ulashish
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 -mt-12 relative z-10">
                    <div className="bg-white border border-[#e2e8f0] rounded-[3rem] shadow-2xl p-4 md:p-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-[#f1f5f9] pb-8">
                                <TabsList className="bg-[#f8fafc] p-1.5 rounded-[1.25rem] inline-flex">
                                    <TabsTrigger value="stream" className="rounded-xl px-8 h-11 font-black data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Lenta</TabsTrigger>
                                    <TabsTrigger value="curriculum" className="rounded-xl px-8 h-11 font-black data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Dastur</TabsTrigger>
                                    <TabsTrigger value="people" className="rounded-xl px-8 h-11 font-black data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Odamlar</TabsTrigger>
                                    <TabsTrigger value="grades" className="rounded-xl px-8 h-11 font-black data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Baholar</TabsTrigger>
                                </TabsList>

                                {isOwner && (
                                    <div className="flex flex-wrap gap-3">
                                        <Button className="rounded-2xl h-11 bg-primary px-6 font-black gap-2 shadow-lg shadow-primary/20" onClick={() => setIsLessonFormOpen(true)}>
                                            <Plus className="w-4 h-4" /> Mavzu
                                        </Button>
                                        <Button className="rounded-2xl h-11 bg-[#f59e0b] px-6 font-black gap-2 shadow-lg shadow-amber-500/20 border-none" onClick={() => setIsQuizFormOpen(true)}>
                                            <Plus className="w-4 h-4" /> Test
                                        </Button>
                                        <Button className="rounded-2xl h-11 bg-[#10b981] px-6 font-black gap-2 shadow-lg shadow-emerald-500/20 border-none" onClick={() => setIsAssignmentFormOpen(true)}>
                                            <Plus className="w-4 h-4" /> Vazifa
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="pt-10">
                                <TabsContent value="stream">
                                    <div className="grid lg:grid-cols-4 gap-10">
                                        {/* Left Column Stats */}
                                        <div className="lg:col-span-1 space-y-6">
                                            <div className="bg-[#f8fafc] p-8 rounded-[2rem] border border-[#f1f5f9] space-y-4">
                                                <h3 className="text-[10px] font-black uppercase text-[#94a3b8] tracking-widest px-1">Sinf Kodi</h3>
                                                <div className="bg-white p-5 rounded-[1.5rem] border border-[#e2e8f0] flex items-center justify-between shadow-sm">
                                                    <span className="font-mono text-2xl font-black text-primary tracking-[0.2em]">{currentCourse.joinCode}</span>
                                                    <IconButton size="small" className="text-primary hover:bg-primary/5">
                                                        <ClipboardList className="w-5 h-5" />
                                                    </IconButton>
                                                </div>
                                                <p className="text-[11px] text-[#94a3b8] font-bold text-center">Bu kodni o'quvchilarga yuboring.</p>
                                            </div>

                                            <div className="bg-white p-8 rounded-[2rem] border border-[#f1f5f9] shadow-sm space-y-6">
                                                <h3 className="text-[10px] font-black uppercase text-[#94a3b8] tracking-widest px-1">Tezkor Ma'lumot</h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                                            <Calendar className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-[#94a3b8] uppercase">Yaratilgan</p>
                                                            <p className="text-sm font-bold text-[#334155]">{new Date(currentCourse.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] flex items-center justify-center text-[#10b981]">
                                                            <Zap className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-[#94a3b8] uppercase">Status</p>
                                                            <p className="text-sm font-bold text-[#334155]">Faol</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Feed Section */}
                                        <div className="lg:col-span-3 space-y-8">
                                            {isOwner && (
                                                <div className="bg-white border-2 border-[#f1f5f9] rounded-[2.25rem] transition-all hover:border-primary/20 overflow-hidden shadow-sm">
                                                    {!isAnnouncementExpanded ? (
                                                        <div className="p-6 flex items-center gap-5 cursor-pointer group" onClick={() => setIsAnnouncementExpanded(true)}>
                                                            <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                                                                {user?.name?.[0]}
                                                            </Avatar>
                                                            <span className="text-[#94a3b8] font-bold text-lg group-hover:text-primary/70 transition-colors">Sinfingizga biror narsa e'lon qiling...</span>
                                                        </div>
                                                    ) : (
                                                        <div className="p-8 space-y-6">
                                                            <textarea 
                                                                className="w-full bg-[#f8fafc] rounded-2xl p-6 min-h-[150px] focus:outline-none border-2 border-[#e2e8f0] focus:border-primary text-lg font-medium transition-all"
                                                                placeholder="Xabaringizni yozing..."
                                                                value={announcementText}
                                                                onChange={(e) => setAnnouncementText(e.target.value)}
                                                                autoFocus
                                                            />
                                                            <div className="flex justify-end gap-3">
                                                                <Button variant="ghost" className="h-12 px-8 rounded-xl font-bold" onClick={() => setIsAnnouncementExpanded(false)}>Bekor qilish</Button>
                                                                <Button className="h-12 px-10 rounded-xl font-black bg-primary shadow-xl shadow-primary/20" onClick={handlePostAnnouncement}>Yuborish</Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="space-y-6">
                                                <AnimatePresence>
                                                    {feedItems.length > 0 ? feedItems.map((item, i) => (
                                                        <motion.div 
                                                            key={item._id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="group bg-white border border-[#f1f5f9] p-6 rounded-[2rem] hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer flex items-center gap-6"
                                                            onClick={() => {
                                                                if (item.type === 'lesson') navigate(`/lessons/${item._id}`);
                                                                else if (item.type === 'quiz') navigate(`/lessons/${item.lessonId || id}/quiz`);
                                                            }}
                                                        >
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                                                                item.type === 'quiz' ? 'bg-[#fffbeb] text-[#d97706]' : 
                                                                item.type === 'assignment' ? 'bg-[#ecfdf5] text-[#10b981]' : 
                                                                item.type === 'announcement' ? 'bg-[#f3e8ff] text-[#7c3aed]' : 'bg-[#eff6ff] text-[#3b82f6]'
                                                            }`}>
                                                                {item.type === 'quiz' ? <BookOpen className="w-7 h-7" /> : 
                                                                 item.type === 'assignment' ? <FileText className="w-7 h-7" /> : 
                                                                 item.type === 'announcement' ? <MessageSquare className="w-7 h-7" /> : <PlayCircle className="w-7 h-7" />}
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="text-lg font-black text-[#1e293b] group-hover:text-primary transition-colors line-clamp-1">
                                                                        {item.type === 'announcement' ? 'Sinf e\'loni' : item.title}
                                                                    </h4>
                                                                    <Badge variant="outline" className="bg-[#f8fafc] border-[#e2e8f0] text-[#94a3b8] font-bold rounded-lg py-0.5">
                                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-[#64748b] font-medium line-clamp-2 leading-relaxed">
                                                                    {item.type === 'announcement' ? item.content : (item.description || item.textContent)}
                                                                </p>
                                                            </div>
                                                            <div className="w-10 h-10 rounded-full bg-[#f8fafc] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                                                                <ArrowRight className="w-5 h-5 text-primary" />
                                                            </div>
                                                        </motion.div>
                                                    )) : (
                                                        <div className="py-20 text-center space-y-4 bg-[#f8fafc] border-2 border-dashed border-[#e2e8f0] rounded-[3rem]">
                                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                                                                <ClipboardList className="w-10 h-10 text-[#cbd5e1]" />
                                                            </div>
                                                            <p className="text-[#94a3b8] font-black text-xl">Hozircha hech qanday yangilik yo'q</p>
                                                        </div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="curriculum">
                                    <div className="max-w-4xl mx-auto py-10 space-y-12">
                                        {currentCourse.topics?.map((topic, topicIdx) => (
                                            <div key={topic._id} className="space-y-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">
                                                        {topicIdx + 1}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase text-[#94a3b8] tracking-[0.2em]">Bo'lim</p>
                                                        <h3 className="text-2xl font-black text-[#1e293b]">{topic.title}</h3>
                                                    </div>
                                                </div>
                                                <div className="grid gap-4 pl-16">
                                                    {topic.lessons?.map((lesson, lessonIdx) => {
                                                        const isLocked = lessonIdx > 0 && !topic.lessons[lessonIdx - 1].isCompleted;
                                                        return (
                                                            <motion.div 
                                                                key={lesson._id}
                                                                whileHover={!isLocked ? { scale: 1.01 } : {}}
                                                                className={`group p-6 rounded-[1.75rem] border transition-all flex items-center justify-between ${
                                                                    isLocked 
                                                                    ? 'bg-[#f8fafc] border-[#f1f5f9] opacity-60' 
                                                                    : 'bg-white border-[#e2e8f0] hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 cursor-pointer'
                                                                }`}
                                                                onClick={() => !isLocked && navigate(`/lessons/${lesson._id}`)}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                                        lesson.isCompleted ? 'bg-[#ecfdf5] text-[#10b981]' : 
                                                                        isLocked ? 'bg-[#f1f5f9] text-[#94a3b8]' : 'bg-primary/5 text-primary'
                                                                    }`}>
                                                                        {lesson.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                                                                         isLocked ? <Lock className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-black text-[#1e293b] group-hover:text-primary transition-colors">{lesson.title}</h4>
                                                                        <p className="text-[11px] font-bold text-[#94a3b8]">{lesson.duration || '20 min'} • {lesson.type || 'Video dars'}</p>
                                                                    </div>
                                                                </div>
                                                                {!isLocked && <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all" />}
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Forms Dialogs */}
            <AnimatePresence>
                {isLessonFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsLessonFormOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative z-10 p-10">
                             <LessonForm courseId={id} onComplete={() => setIsLessonFormOpen(false)} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </NavbarWithDrawer>
    );
};

// Mock Avatar for detail
const Avatar = ({ children, sx }) => (
  <Box sx={{ 
    ...sx, 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    fontWeight: 'black',
    fontSize: '1rem',
    color: sx.bgcolor === 'primary.main' ? 'white' : 'inherit'
  }}>
    {children}
  </Box>
);

const IconButton = ({ children, onClick, size, className }) => (
  <button onClick={onClick} className={`p-2 rounded-lg transition-colors ${className}`}>
    {children}
  </button>
);

export default CourseDetail;
