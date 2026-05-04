import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyCourses, createCourse, joinCourse, getOfficialCourses } from '../../store/Slice/courseSlice';
import { logout } from '../../store/Slice/authSlice';
import { 
  Plus, 
  Play, 
  Boxes,
  Hash,
  ArrowRight,
  Search,
  Filter,
  Users,
  Layout,
  BookOpen,
  Sparkles,
  Rocket
} from 'lucide-react';
import Swal from 'sweetalert2';
import NavbarWithDrawer from '../NavDrawer';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const CourseList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courses, officialCourses, loading, error } = useSelector((state) => state.courses);
    const { user } = useSelector((state) => state.auth);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newCourse, setNewCourse] = useState({ title: '', description: '', thumbnail: '' });
    const [joinCode, setJoinCode] = useState('');

    useEffect(() => {
        dispatch(getMyCourses());
        dispatch(getOfficialCourses());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            const isAuthError = typeof error === 'string' && (
                error.includes('401') || error.toLowerCase().includes('token')
            );
            if (isAuthError) {
                Swal.fire({
                    title: 'Sessiya muddati tugadi',
                    text: 'Iltimos, qaytadan tizimga kiring',
                    icon: 'warning'
                }).then(() => {
                    dispatch(logout());
                    navigate('/login');
                });
            }
        }
    }, [error, navigate, dispatch]);

    const handleCreate = async () => {
        if (!newCourse.title || !newCourse.description) return;
        const payload = { 
            ...newCourse, 
            isOfficial: false 
        };
        const action = await dispatch(createCourse(payload));
        if (createCourse.fulfilled.match(action)) {
            Swal.fire('Muvaffaqiyatli', 'Kurs yaratildi', 'success');
            setIsCreateOpen(false);
            setNewCourse({ title: '', description: '', thumbnail: '' });
            dispatch(getOfficialCourses());
            dispatch(getMyCourses());
        }
    };

    const handleJoin = async () => {
        if (!joinCode) return;
        const action = await dispatch(joinCourse(joinCode));
        if (joinCourse.fulfilled.match(action)) {
            Swal.fire('Muvaffaqiyatli', 'Sinfga qo\'shildingiz', 'success');
            setIsJoinOpen(false);
            setJoinCode('');
            dispatch(getMyCourses());
        } else {
            Swal.fire('Xatolik', action.payload || 'Kod noto\'g\'ri', 'error');
        }
    };

    const currentCourses = courses;
    const filteredCourses = (currentCourses || []).filter(c => 
        (c.title && c.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const CourseCard = ({ course, isOfficial, index }) => {
        const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop";
        
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative h-full"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 rounded-[2.5rem] blur-2xl transition-opacity duration-500" />
                
                <div className="relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full z-10">
                    <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden">
                        <img
                            src={course.thumbnail || defaultImage}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            onError={(e) => { e.target.src = defaultImage; }}
                        />
                        
                        <div className="absolute top-5 left-5 flex flex-col gap-2 z-20">
                            {isOfficial ? (
                                <Badge className="bg-primary backdrop-blur-md text-white border-0 shadow-lg px-4 py-1.5 font-black text-[9px] uppercase tracking-widest rounded-xl">Platforma</Badge>
                            ) : (
                                <Badge className="bg-[#10b981] backdrop-blur-md text-white border-0 shadow-lg px-4 py-1.5 font-black text-[9px] uppercase tracking-widest rounded-xl">Sinfxona</Badge>
                            )}
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        
                        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end z-20">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Mavzu</span>
                                <h3 className="text-white text-xl font-black leading-tight line-clamp-1">{course.title}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                        <p className="text-slate-500 font-medium text-sm line-clamp-2 leading-relaxed mb-6">
                            {course.description || "Ushbu sinfxona orqali siz o'qituvchi bilan birga darslarni o'rganishingiz mumkin."}
                        </p>

                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">O'qituvchi</span>
                                    <span className="text-xs font-black text-slate-700">{course.instructor?.name || 'Admin'}</span>
                                </div>
                            </div>

                            <Button 
                                variant="contained"
                                className="rounded-xl px-6 h-10 font-black text-[10px] uppercase tracking-widest bg-[#0f172a] text-white hover:bg-primary transition-colors border-none"
                                onClick={() => navigate(`/courses/${course._id}`)}
                            >
                                KIRISH
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <NavbarWithDrawer>
            <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans selection:bg-primary/20">
                {/* Modern Header Section */}
                <div className="relative overflow-hidden bg-[#0f172a] pt-16 pb-28 px-6">
                    <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="max-w-[1200px] mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Bilimlar platformasi</span>
                                </div>
                                <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                                    Sinfxonalar <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
                                        roʻyxati
                                    </span>
                                </h1>
                                <p className="text-slate-400 text-lg font-medium max-w-lg leading-relaxed">
                                    Innovatsion va zamonaviy multimodal taʼlim platformasi. 
                                    Oʻzingizga maʼqul boʻlgan yoʻnalishni tanlang.
                                </p>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                transition={{ delay: 0.2 }}
                                className="flex gap-4"
                            >
                                {user?.role === 'super-admin' && (
                                    <Button 
                                        className="h-16 px-10 rounded-2xl bg-primary hover:bg-white hover:text-primary text-white font-black shadow-xl shadow-primary/20 gap-2 border-none transition-all duration-300 group"
                                        onClick={() => setIsCreateOpen(true)}
                                    >
                                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                        Yaratish
                                    </Button>
                                )}
                                {user?.role === 'student' && (
                                    <Button 
                                        className="h-16 px-10 rounded-2xl bg-[#10b981] hover:bg-white hover:text-[#10b981] text-white font-black shadow-xl shadow-emerald-500/20 gap-2 border-none transition-all duration-300 group"
                                        onClick={() => setIsJoinOpen(true)}
                                    >
                                        <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                        Sinfga qo'shilish
                                    </Button>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1200px] mx-auto px-6">
                    {/* Search Bar - Floating Effect */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.4 }}
                        className="bg-white p-2 mb-16 -mt-10 rounded-3xl shadow-xl shadow-slate-200/50 flex items-center gap-4 border border-slate-100 relative z-20"
                    >
                        <div className="flex-1 flex items-center px-6 gap-3">
                            <Search className="w-5 h-5 text-slate-300" />
                            <input 
                                type="text"
                                placeholder="Sinflarni qidiring..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 bg-transparent outline-none font-bold text-lg text-slate-700 placeholder:text-slate-300"
                            />
                        </div>
                        
                        <div className="px-6">
                            <Badge className="bg-primary/10 text-primary border-none px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest">
                                {filteredCourses.length} TA SINFXONA
                            </Badge>
                        </div>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-96 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse" />
                            ))}
                        </div>
                    ) : filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredCourses.map((course, index) => (
                                    <CourseCard 
                                        key={course._id} 
                                        course={course} 
                                        isOfficial={course.isOfficial} 
                                        index={index}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="text-center py-24 bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-[3rem] space-y-6"
                        >
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                                <Boxes className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-[#0f172a]">Kurslar topilmadi</h3>
                                <p className="text-slate-500 font-medium">Bu bo'limda hozircha darslar mavjud emas.</p>
                            </div>
                            <Button variant="outline" className="rounded-xl px-8 h-12 font-black border-2" onClick={() => setSearchQuery('')}>Qidiruvni tozalash</Button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Create Dialog */}
            <AnimatePresence>
                {isCreateOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md" onClick={() => setIsCreateOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                            <div className="p-8 space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-[#1e293b]">Yangi kurs yaratish</h2>
                                    <p className="text-slate-500 font-medium text-sm">Platformada yangi darslik kiriting.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Kurs nomi</label>
                                        <input className="w-full h-14 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white px-5 outline-none transition-all font-bold text-slate-700" placeholder="Masalan: Web dasturlash" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Tavsif</label>
                                        <textarea className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-5 min-h-[120px] focus:outline-none transition-all text-sm font-bold text-slate-700" placeholder="Kurs haqida batafsil..." value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-slate-400" onClick={() => setIsCreateOpen(false)}>Bekor qilish</Button>
                                    <Button className="flex-1 h-14 rounded-2xl font-black bg-primary text-white shadow-lg shadow-primary/20 border-none" onClick={handleCreate}>Yaratish</Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Join Dialog */}
            <AnimatePresence>
                {isJoinOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md" onClick={() => setIsJoinOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                            <div className="p-10 text-center space-y-8">
                                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto text-[#10b981]">
                                    <Hash className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black text-[#1e293b]">Sinfga qo'shilish</h2>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">O'qituvchi bergan 6 xonali kodni kiriting.</p>
                                </div>
                                <input className="w-full h-16 rounded-2xl text-center text-4xl font-black tracking-[0.3em] bg-slate-50 border-2 border-transparent focus:border-[#10b981] focus:bg-white outline-none transition-all uppercase text-[#1e293b]" placeholder="000000" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} maxLength={6} />
                                <div className="space-y-3">
                                    <Button className="w-full h-14 rounded-2xl font-black bg-[#10b981] hover:bg-[#059669] text-white shadow-lg shadow-emerald-500/20 border-none" onClick={handleJoin}>Qo'shilish</Button>
                                    <Button variant="ghost" className="w-full h-12 rounded-2xl font-black text-slate-400" onClick={() => setIsJoinOpen(false)}>Bekor qilish</Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </NavbarWithDrawer>
    );
};

export default CourseList;
