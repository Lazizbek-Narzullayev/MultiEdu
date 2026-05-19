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
import { Box } from '@mui/material';
import { API_BASE_URL } from '../../config/apiConfig';
import NavbarWithDrawer from '../NavDrawer';
import LessonForm from '../Multimodal/LessonForm';
import QuizForm from '../Multimodal/QuizForm';
import AssignmentForm from '../Multimodal/AssignmentForm';
import SubmissionModal from '../Multimodal/SubmissionModal';
import GradingModal from '../Multimodal/GradingModal';
import Swal from 'sweetalert2';

import { getCourseById, updateCourse, deleteCourse } from '../../store/Slice/courseSlice';
import { getCourseQuizzes, getCourseAllAttempts } from '../../store/Slice/quizSlice';
import { getCourseAssignments } from '../../store/Slice/assignmentSlice';
import { getCourseGrades } from '../../store/Slice/submissionSlice';
import { getCourseAnnouncements, createAnnouncement } from '../../store/Slice/announcementSlice';
import CourseForm from './CourseForm';

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
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isGradingOpen, setIsGradingOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [isFabOpen, setIsFabOpen] = useState(false);

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

    const isTeacher = ['teacher', 'admin', 'super-admin'].includes(user?.role?.toLowerCase());
    const courseTeacherId = currentCourse?.teacher?._id || currentCourse?.teacher;
    const isOwner = courseTeacherId === user?._id;

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

    const handleDeleteCourse = async () => {
        const result = await Swal.fire({
            title: 'Kursni o\'chirish?',
            text: "Ushbu amalni ortga qaytarib bo'lmaydi!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ha, o\'chirilsin!',
            cancelButtonText: 'Bekor qilish'
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deleteCourse(id)).unwrap();
                Swal.fire('O\'chirildi!', 'Kurs muvaffaqiyatli o\'chirildi.', 'success');
                navigate('/courses');
            } catch (error) {
                Swal.fire('Xato', error || 'O\'chirishda xatolik', 'error');
            }
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
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20 max-w-[1440px] mx-auto w-full">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                            <div className="space-y-6 max-w-4xl">
                                <Badge className="bg-primary text-white border-none px-6 py-2 font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-primary/40 rounded-full">
                                    {currentCourse.isOfficial ? "Rasmiy Kurs" : "Sinf xonasi"}
                                </Badge>
                                <h1 className="text-5xl md:text-9xl font-black text-white tracking-tight leading-[0.95] drop-shadow-2xl">
                                    {currentCourse.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-8 text-white/95 font-black pt-4">
                                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-[1.5rem] border border-white/20">
                                        <Avatar sx={{ width: 44, height: 44, bgcolor: '#7c3aed', border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                                            {currentCourse.teacher?.name?.[0] || 'L'}
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase text-white/60 tracking-widest">O'qituvchi</span>
                                            <span className="text-base">{currentCourse.teacher?.name || "MultiEdu Academy"}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                            <Users className="w-6 h-6 text-primary" />
                                        </div>
                                        <span className="text-lg">{currentCourse.students?.length || 0} o'quvchi</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                            <BookOpen className="w-6 h-6 text-primary" />
                                        </div>
                                        <span className="text-lg">{currentCourse.lessons?.length || 0} dars</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 pb-4">
                                {isOwner && (
                                    <>
                                        <Button 
                                            variant="outline" 
                                            className="h-16 bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary rounded-[1.5rem] backdrop-blur-md px-8 font-black transition-all duration-500 text-lg"
                                            onClick={() => setIsEditOpen(true)}
                                        >
                                            <Settings className="w-6 h-6 mr-3" />
                                            Sozlamalar
                                        </Button>
                                    </>
                                )}
                                <Button className="h-16 bg-white text-primary hover:bg-slate-100 rounded-[1.5rem] px-10 shadow-2xl shadow-black/30 font-black text-lg transition-all duration-500">
                                    <Share2 className="w-6 h-6 mr-3" />
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
                                                            <p className="text-sm font-bold text-[#334155]">
                                                                {currentCourse.createdAt && !isNaN(new Date(currentCourse.createdAt)) 
                                                                    ? new Date(currentCourse.createdAt).toLocaleDateString() 
                                                                    : 'Sana mavjud emas'}
                                                            </p>
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
                                                                        {item.createdAt && !isNaN(new Date(item.createdAt))
                                                                            ? new Date(item.createdAt).toLocaleDateString()
                                                                            : 'Yaqinda'}
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

                                <TabsContent value="people">
                                    <div className="py-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {currentCourse.students?.map((student) => (
                                                <div key={student._id} className="bg-white border border-[#f1f5f9] p-6 rounded-[2.5rem] flex items-center gap-5 hover:shadow-xl hover:shadow-primary/5 transition-all group">
                                                    <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main', border: '4px solid #f8fafc' }}>
                                                        {student.name?.[0]}
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-lg font-black text-[#1e293b] group-hover:text-primary transition-colors truncate">{student.name}</h4>
                                                        <p className="text-sm font-bold text-[#94a3b8] truncate">{student.email}</p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-xl bg-[#f8fafc] flex items-center justify-center text-[#94a3b8] group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                                        <MessageSquare className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            ))}
                                            {(!currentCourse.students || currentCourse.students.length === 0) && (
                                                <div className="col-span-full py-20 text-center space-y-4 bg-[#f8fafc] border-2 border-dashed border-[#e2e8f0] rounded-[3rem]">
                                                    <Users className="w-12 h-12 text-[#cbd5e1] mx-auto" />
                                                    <p className="text-[#94a3b8] font-black text-xl">Hozircha hech qanday talaba yo'q</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="grades">
                                    <div className="py-10 space-y-6">
                                        <div className="grid grid-cols-1 gap-4">
                                            {assignments?.map((assignment) => (
                                                <div key={assignment._id} className="bg-white border border-[#f1f5f9] p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-2xl transition-all">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                                            <FileText className="w-8 h-8" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h3 className="text-xl font-black text-[#1e293b]">{assignment.title}</h3>
                                                            <div className="flex items-center gap-3">
                                                                <Badge className="bg-[#f8fafc] text-[#94a3b8] border-[#e2e8f0] font-bold">Maksimal ball: {assignment.maxScore}</Badge>
                                                                <span className="text-xs font-bold text-[#94a3b8]">{new Date(assignment.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right hidden sm:block mr-4">
                                                            <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">Yuborilganlar</p>
                                                            <p className="text-lg font-black text-emerald-600">
                                                                {allCourseGrades?.filter(g => g.assignmentId === assignment._id).length || 0} / {currentCourse.students?.length || 0}
                                                            </p>
                                                        </div>
                                                        <Button 
                                                            className="rounded-2xl h-14 px-8 font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 gap-2"
                                                            onClick={() => {
                                                                setSelectedAssignment(assignment);
                                                                setIsGradingOpen(true);
                                                            }}
                                                        >
                                                            Monitoring & Baholash
                                                            <ChevronRight className="w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!assignments || assignments.length === 0) && (
                                                <div className="py-20 text-center space-y-4 bg-[#f8fafc] border-2 border-dashed border-[#e2e8f0] rounded-[3rem]">
                                                    <GraduationCap className="w-12 h-12 text-[#cbd5e1] mx-auto" />
                                                    <p className="text-[#94a3b8] font-black text-xl">Hozircha topshiriqlar yo'q</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>

            {/* Floating Action Button (FAB) - Moved outside and changed to isTeacher */}
            {(isTeacher || isOwner) && (
                <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
                    <AnimatePresence>
                        {isFabOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                className="flex flex-col items-end gap-3 mb-2"
                            >
                                {[
                                    { label: "Mavzu qo'shish", icon: BookOpen, color: "bg-primary", onClick: () => setIsLessonFormOpen(true) },
                                    { label: "Test yaratish", icon: Sparkles, color: "bg-[#f59e0b]", onClick: () => setIsQuizFormOpen(true) },
                                    { label: "Vazifa yuklash", icon: FileText, color: "bg-[#10b981]", onClick: () => setIsAssignmentFormOpen(true) },
                                ].map((item, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.05, x: -5 }}
                                        onClick={() => { item.onClick(); setIsFabOpen(false); }}
                                        className="flex items-center gap-3 group"
                                    >
                                        <span className="bg-white text-[#1e293b] text-xs font-black px-4 py-2 rounded-xl shadow-xl border border-[#f1f5f9] opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.label}
                                        </span>
                                        <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-black/10`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsFabOpen(!isFabOpen)}
                        className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${isFabOpen ? 'bg-[#1e293b] rotate-45' : 'bg-primary shadow-primary/40'}`}
                    >
                        <Plus className="w-8 h-8" />
                    </motion.button>
                </div>
            )}

            {/* Forms Dialogs */}
            <AnimatePresence>
                {isLessonFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsLessonFormOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative z-10 p-10">
                             <LessonForm courseId={id} onComplete={() => { setIsLessonFormOpen(false); dispatch(getCourseById(id)); }} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isEditOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsEditOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                            <div className="p-8 space-y-8">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-[#1e293b]">Kursni tahrirlash</h2>
                                    <p className="text-[#64748b] font-medium text-sm">Kurs ma'lumotlarini o'zgartirish.</p>
                                </div>
                                <CourseForm 
                                    courseId={id} 
                                    initialData={currentCourse} 
                                    onComplete={() => { setIsEditOpen(false); dispatch(getCourseById(id)); }} 
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            <GradingModal 
                open={isGradingOpen} 
                onClose={() => setIsGradingOpen(false)} 
                assignment={selectedAssignment} 
            />

            <AnimatePresence>
                {isQuizFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsQuizFormOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative z-10 p-10">
                             <QuizForm courseId={id} onComplete={() => { setIsQuizFormOpen(false); dispatch(getCourseQuizzes(id)); dispatch(getCourseById(id)); }} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAssignmentFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsAssignmentFormOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative z-10 p-10">
                             <AssignmentForm courseId={id} onComplete={() => { setIsAssignmentFormOpen(false); dispatch(getCourseAssignments(id)); dispatch(getCourseById(id)); }} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            </div>
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
