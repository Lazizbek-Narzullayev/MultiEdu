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
  GraduationCap,
  ArrowRight,
  Search,
  Filter,
  Users,
  Layout
} from 'lucide-react';
import Swal from 'sweetalert2';
import NavbarWithDrawer from '../NavDrawer';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';

const CourseList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courses, officialCourses, loading, error } = useSelector((state) => state.courses);
    const { user } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState(user?.role === 'super-admin' ? "official" : "classroom");
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
            isOfficial: user?.role === 'super-admin' && activeTab === "official" 
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

    const currentCourses = activeTab === "official" ? officialCourses : courses;
    const filteredCourses = (currentCourses || []).filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const CourseCard = ({ course, isOfficial, index }) => {
        const defaultImage = "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop";
        
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group bg-white border border-[#f1f5f9] rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full"
            >
                <div className="aspect-[16/9] bg-[#f8fafc] relative overflow-hidden">
                    <img
                        src={course.thumbnail || defaultImage}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { e.target.src = defaultImage; }}
                    />
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                        {isOfficial ? (
                            <Badge className="bg-primary/90 backdrop-blur-md text-white border-0 shadow-lg px-3 py-1 font-black text-[10px] uppercase tracking-wider">Official</Badge>
                        ) : (
                            <Badge className="bg-emerald-500/90 backdrop-blur-md text-white border-0 shadow-lg px-3 py-1 font-black text-[10px] uppercase tracking-wider">Classroom</Badge>
                        )}
                        {!isOfficial && user?.role === 'teacher' && (
                            <Badge className="bg-white/90 backdrop-blur-md text-[#0f172a] border-0 shadow-lg font-black tracking-[0.2em] text-[10px]">
                                {course.joinCode}
                            </Badge>
                        )}
                    </div>

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 text-primary fill-primary" />
                        </div>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                        <h3 className="text-[1.1rem] font-black text-[#0f172a] leading-tight group-hover:text-primary transition-colors line-clamp-2 h-[2.8rem] mb-2">
                            {course.title}
                        </h3>
                        <p className="text-[0.85rem] text-[#64748b] font-medium line-clamp-2 leading-relaxed h-[2.6rem] mb-4">
                            {course.description}
                        </p>
                    </div>

                    <div className="mt-auto pt-5 border-t border-[#f1f5f9] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#f3e8ff] flex items-center justify-center text-[#7c3aed]">
                                <Users className="w-4 h-4" />
                            </div>
                            <span className="text-[0.65rem] font-black text-[#64748b] uppercase tracking-wider truncate max-w-[120px]">
                                {course.instructor?.name || 'MultiEdu Academy'}
                            </span>
                        </div>
                        <Button 
                            variant="ghost"
                            className="h-9 px-4 rounded-xl text-primary font-black gap-2 hover:bg-primary/5 text-[0.85rem]"
                            onClick={() => navigate(`/courses/${course._id}`)}
                        >
                            Kirish
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <NavbarWithDrawer>
            <div className="min-h-screen bg-[#f8fafc] pb-20">
                {/* Premium Dark Header */}
                <div className="relative overflow-hidden bg-[#0f172a] pt-12 pb-24 px-6">
                    <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 text-primary">
                                    <Layout className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">O'quv tizimi</span>
                                </div>
                                <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight">
                                    {activeTab === "official" ? "Rasmiy kurslar" : "Sinflar"}
                                </h1>
                                <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">
                                    Eng ilg'or bilimlar va zamonaviy darsliklarni bizning multimodal platformada kashf qiling.
                                </p>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap gap-4"
                            >
                                {user?.role === 'super-admin' && (
                                    <Button 
                                        className="h-14 px-8 rounded-[1.25rem] bg-primary hover:bg-primary/90 text-white font-black shadow-2xl shadow-primary/20 gap-2 border-none"
                                        onClick={() => setIsCreateOpen(true)}
                                    >
                                        <Plus className="w-5 h-5" />
                                        Yangi kurs yaratish
                                    </Button>
                                )}
                                {user?.role === 'student' && (
                                    <Button 
                                        className="h-14 px-8 rounded-[1.25rem] bg-[#10b981] hover:bg-[#059669] text-white font-black shadow-2xl shadow-emerald-500/20 gap-2 border-none"
                                        onClick={() => setIsJoinOpen(true)}
                                    >
                                        <Hash className="w-5 h-5" />
                                        Sinfga qo'shilish
                                    </Button>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    {/* Search & Tabs Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.3 }}
                        className="bg-white p-2 mb-12 -mt-8 rounded-[1.5rem] shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-4 border border-[#f1f5f9] relative z-20"
                    >
                        <div className="flex-1 w-full flex items-center px-4 gap-3">
                            <Search className="w-5 h-5 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Kurslarni qidirish..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 bg-transparent outline-none font-bold text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                        
                        <div className="h-10 w-px bg-slate-100 hidden md:block" />
                        
                        <div className="flex items-center gap-4 px-2 w-full md:w-auto">
                            {user?.role === 'super-admin' ? (
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-slate-50 p-1 rounded-xl">
                                    <TabsList className="bg-transparent h-10 gap-1">
                                        <TabsTrigger value="official" className="rounded-lg px-6 font-black data-[state=active]:bg-white data-[state=active]:shadow-sm">Rasmiy</TabsTrigger>
                                        <TabsTrigger value="classroom" className="rounded-lg px-6 font-black data-[state=active]:bg-white data-[state=active]:shadow-sm">Sinfxonalar</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            ) : (
                                <div className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest px-4">
                                    <Filter className="w-4 h-4" />
                                    Filterlar
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-[400px] bg-white border border-[#f1f5f9] rounded-[2rem] animate-pulse" />
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
                            className="text-center py-24 bg-white/50 backdrop-blur-sm border-2 border-dashed border-[#e2e8f0] rounded-[3rem] space-y-6"
                        >
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                                <Boxes className="w-10 h-10 text-slate-300" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-[#1e293b]">Hech narsa topilmadi</h3>
                                <p className="text-[#64748b] font-medium">Qidiruv natijalari bo'yicha kurslar mavjud emas.</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Create Dialog */}
            <AnimatePresence>
                {isCreateOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsCreateOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                            <div className="p-8 space-y-8">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-[#1e293b]">Yangi kurs yaratish</h2>
                                    <p className="text-[#64748b] font-medium text-sm">Platformada yangi rasmiy darslik yoki sinfxona kiriting.</p>
                                </div>
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-[#94a3b8] ml-1 tracking-widest">Kurs nomi</label>
                                        <input className="w-full h-14 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white px-4 outline-none transition-all font-bold text-slate-700" placeholder="Masalan: Web dasturlash" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-[#94a3b8] ml-1 tracking-widest">Qisqacha tavsif</label>
                                        <textarea className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-4 min-h-[120px] focus:outline-none transition-all text-sm font-bold text-slate-700" placeholder="Kurs haqida qisqacha ma'lumot..." value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="ghost" className="flex-1 h-12 rounded-xl font-black text-[#64748b]" onClick={() => setIsCreateOpen(false)}>Bekor qilish</Button>
                                    <Button className="flex-1 h-12 rounded-xl font-black bg-primary text-white shadow-xl shadow-primary/20 border-none" onClick={handleCreate}>Yaratish</Button>
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsJoinOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl relative z-10 overflow-hidden">
                            <div className="p-10 text-center space-y-8">
                                <div className="w-16 h-16 bg-[#ecfdf5] rounded-2xl flex items-center justify-center mx-auto text-[#10b981]">
                                    <Hash className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-xl font-black text-[#1e293b]">Sinfga qo'shilish</h2>
                                    <p className="text-[0.8rem] text-[#64748b] font-medium leading-relaxed">O'qituvchi bergan 6 xonali kodni kiriting.</p>
                                </div>
                                <input className="w-full h-16 rounded-2xl text-center text-3xl font-black tracking-[0.3em] bg-slate-50 border-2 border-transparent focus:border-[#10b981] focus:bg-white outline-none transition-all placeholder:text-xs placeholder:tracking-normal uppercase" placeholder="KODNI YOZING" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} maxLength={6} />
                                <div className="space-y-2">
                                    <Button className="w-full h-12 rounded-xl font-black bg-[#10b981] hover:bg-[#059669] text-white shadow-xl shadow-emerald-500/20 border-none" onClick={handleJoin}>Qo'shilish</Button>
                                    <Button variant="ghost" className="w-full h-12 rounded-xl font-black text-[#64748b]" onClick={() => setIsJoinOpen(false)}>Bekor qilish</Button>
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
