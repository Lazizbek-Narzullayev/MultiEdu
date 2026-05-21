import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getOfficialStats, getTeacherClassesStats } from '../../store/Slice/courseSlice';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  TrendingUp, 
  Activity, 
  Cpu, 
  Database, 
  Cloud, 
  Plus, 
  Settings, 
  BarChart3, 
  ShieldCheck,
  ChevronRight,
  Clock,
  ExternalLink,
  Search,
  Bell,
  MoreVertical,
  LayoutGrid,
  ListFilter,
  GraduationCap,
  Download,
  ChevronDown
} from 'lucide-react';

import { API_BASE_URL } from '../../config/apiConfig';
import NavbarWithDrawer from '../../Components/NavDrawer';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';

const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
    });
};

const SuperAdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const { officialStats, teacherClassesStats } = useSelector((state) => state.courses);
    
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

    const handleExport = async (format) => {
        if (!stats?.teacherStats || stats.teacherStats.length === 0) {
            Swal.fire({
                title: "Xatolik!",
                text: "Eksport qilish uchun ma'lumotlar mavjud emas.",
                icon: "warning",
                confirmButtonText: "Ok"
            });
            return;
        }

        Swal.fire({
            title: "Yuklanmoqda...",
            text: "Hujjat tayyorlanmoqda, iltimos kuting.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            if (format === 'excel') {
                await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
                const XLSX = window.XLSX;
                
                const worksheetData = [
                    ["O'qituvchi", "Email", "Kurslar soni", "O'quvchilar soni", "O'rtacha o'zlashtirish (%)"]
                ];
                
                stats.teacherStats.forEach(t => {
                    worksheetData.push([t.name, t.email, t.courseCount, t.totalStudents, t.averageMastery]);
                });
                
                const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "O'qituvchilar reytingi");
                
                XLSX.writeFile(workbook, "oqituvchilar_reytingi.xlsx");
                
            } else if (format === 'pdf') {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js');
                
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                doc.setFontSize(18);
                doc.text("O'qituvchilar Reytingi", 14, 20);
                doc.setFontSize(10);
                doc.text(`Sana: ${new Date().toLocaleDateString()}`, 14, 28);
                
                const tableColumn = ["O'qituvchi", "Email", "Kurslar", "O'quvchilar", "O'zlashtirish"];
                const tableRows = [];
                
                stats.teacherStats.forEach(t => {
                    tableRows.push([t.name, t.email, t.courseCount, t.totalStudents, `${t.averageMastery}%`]);
                });
                
                doc.autoTable({
                    startY: 32,
                    head: [tableColumn],
                    body: tableRows,
                    theme: 'striped',
                    headStyles: { fillColor: [79, 70, 229] },
                    styles: { font: 'helvetica', fontSize: 10 },
                });
                
                doc.save("oqituvchilar_reytingi.pdf");
                
            } else if (format === 'word') {
                const content = `
                    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                    <head>
                        <title>O'qituvchilar reytingi</title>
                        <!--[if gte mso 9]>
                        <xml>
                            <w:WordDocument>
                                <w:View>Print</w:View>
                                <w:Zoom>90</w:Zoom>
                            </w:WordDocument>
                        </xml>
                        <![endif]-->
                        <style>
                            body { font-family: 'Segoe UI', Arial, sans-serif; }
                            h2 { color: #4f46e5; font-size: 20px; margin-bottom: 20px; }
                            table { border-collapse: collapse; width: 100%; margin-top: 10px; }
                            th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 12px; }
                            th { background-color: #4f46e5; color: white; font-weight: bold; }
                            tr:nth-child(even) { background-color: #f8fafc; }
                        </style>
                    </head>
                    <body>
                        <h2>O'qituvchilar reytingi</h2>
                        <p>Sana: ${new Date().toLocaleDateString()}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>O'qituvchi</th>
                                    <th>Email</th>
                                    <th>Kurslar</th>
                                    <th>O'quvchilar</th>
                                    <th>O'zlashtirish</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${stats.teacherStats.map(t => `
                                    <tr>
                                        <td>${t.name}</td>
                                        <td>${t.email}</td>
                                        <td>${t.courseCount}</td>
                                        <td>${t.totalStudents}</td>
                                        <td>${t.averageMastery}%</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </body>
                    </html>
                `;
                const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "oqituvchilar_reytingi.doc";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            
            Swal.fire({
                title: "Muvaffaqiyatli!",
                text: "Hujjat muvaffaqiyatli yuklab olindi.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Export error:", error);
            Swal.fire({
                title: "Xatolik!",
                text: "Hujjat yuklashda xatolik yuz berdi.",
                icon: "error",
                confirmButtonText: "Ok"
            });
        }
    };

    useEffect(() => {
        console.log('Dashboard mounted, fetching stats...');
        fetchStats();
        fetchRecentActivities();
        dispatch(getOfficialStats());
        dispatch(getTeacherClassesStats());
    }, [dispatch]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/admin/system-stats`, {
                headers: { 'x-auth-token': user?.token }
            });
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentActivities = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/recent-activity`, {
                headers: { 'x-auth-token': user?.token }
            });
            setRecentActivities(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading || !stats) {
        return (
            <NavbarWithDrawer>
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </NavbarWithDrawer>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color, subText }) => (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-card border border-border p-6 rounded-[2.5rem] shadow-sm relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 -translate-y-16 translate-x-16 rounded-full group-hover:scale-110 transition-transform duration-500`} />
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="border-border text-[10px] font-black uppercase tracking-wider">Muvaffaqiyatli</Badge>
            </div>
            <div className="space-y-1">
                <h3 className="text-3xl font-black text-foreground tracking-tight">{value}</h3>
                <p className="text-sm font-bold text-muted-foreground">{title}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                {subText}
            </div>
        </motion.div>
    );

    return (
        <NavbarWithDrawer>
            <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
                <div className="max-w-7xl mx-auto space-y-10">
                    {/* Top Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter leading-tight">
                                Tizim <span className="text-primary">boshqaruvi</span>
                            </h1>
                            <p className="text-muted-foreground font-medium">MultiEdu platformasining to'liq monitoring markazi</p>
                        </div>
                        <div className="flex items-center gap-3">
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            title="Jami talabalar" 
                            value={stats.global.totalStudents} 
                            icon={Users} 
                            color="from-blue-500 to-indigo-600"
                            subText={`+${stats.global.studentGrowth || 0}% o'tgan haftadan`}
                        />
                        <StatCard 
                            title="O'qituvchilar" 
                            value={stats.global.totalTeachers} 
                            icon={UserCheck} 
                            color="from-emerald-500 to-teal-600"
                            subText={`+${stats.global.newTeachers || 0} yangi o'qituvchi`}
                        />
                        <StatCard 
                            title="Faol kurslar" 
                            value={stats.global.totalCourses} 
                            icon={BookOpen} 
                            color="from-amber-500 to-orange-600"
                            subText={`${stats.global.newCourses || 0} ta yangi kurs`}
                        />
                        <StatCard 
                            title="Tizim o'zlashtirishi" 
                            value={`${stats.global.averageMastery || 0}%`} 
                            icon={BarChart3} 
                            color="from-primary to-accent"
                            subText="O'rtacha ko'rsatkich"
                        />
                    </div>

                    <Tabs defaultValue="system" className="w-full space-y-8">
                        <div className="flex items-center justify-between bg-white p-2 rounded-[2rem] border border-border shadow-sm overflow-x-auto custom-scrollbar">
                            <TabsList className="bg-transparent h-14 p-1.5 gap-4 min-w-max">
                                <TabsTrigger value="system" className="rounded-2xl font-black px-8 data-[state=active]:bg-primary data-[state=active]:text-white transition-all whitespace-nowrap text-sm h-full">
                                    <Activity className="w-5 h-5 mr-3" />
                                    Tizim faoliyati
                                </TabsTrigger>
                                <TabsTrigger value="official" className="rounded-2xl font-black px-8 data-[state=active]:bg-primary data-[state=active]:text-white transition-all whitespace-nowrap text-sm h-full">
                                    <BookOpen className="w-5 h-5 mr-3" />
                                    Rasmiy darslar
                                </TabsTrigger>
                                <TabsTrigger value="teacher_courses" className="rounded-2xl font-black px-8 data-[state=active]:bg-primary data-[state=active]:text-white transition-all whitespace-nowrap text-sm h-full">
                                    <GraduationCap className="w-5 h-5 mr-3" />
                                    Sinflar monitoringi
                                </TabsTrigger>
                                <TabsTrigger value="teachers" className="rounded-2xl font-black px-8 data-[state=active]:bg-primary data-[state=active]:text-white transition-all whitespace-nowrap text-sm h-full">
                                    <Users className="w-5 h-5 mr-3" />
                                    O'qituvchilar
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="system" className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-white border border-border p-8 rounded-[2.5rem] shadow-sm space-y-8 h-full">
                                    <h2 className="text-xl font-black flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-primary" />
                                        Tizim holati
                                    </h2>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-black uppercase tracking-wider text-muted-foreground">
                                                <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> CPU Yuklamasi</span>
                                                <span className="text-foreground">18%</span>
                                            </div>
                                            <Progress value={18} className="h-2 bg-muted" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-black uppercase tracking-wider text-muted-foreground">
                                                <span className="flex items-center gap-2"><Database className="w-3 h-3" /> RAM Sarfi</span>
                                                <span className="text-foreground">26%</span>
                                            </div>
                                            <Progress value={26} className="h-2 bg-muted" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                                    <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
                                        <h2 className="text-xl font-black flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-primary" />
                                            So'nggi faoliyatlar
                                        </h2>
                                    </div>
                                    <div className="p-0 max-h-[400px] overflow-y-auto custom-scrollbar">
                                        <div className="divide-y divide-border">
                                            {recentActivities.map((act, index) => (
                                                <div key={index} className="p-6 flex items-center gap-6 hover:bg-muted/10 transition-colors group">
                                                    <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                                                        <Clock className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-foreground truncate">{act.title}</p>
                                                        <p className="text-sm text-muted-foreground line-clamp-1">{act.detail}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                                            {new Date(act.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="official" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {officialStats?.map((lesson) => (
                                    <motion.div key={lesson._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                        <Card className="rounded-[2.5rem] border-border overflow-hidden hover:shadow-xl transition-shadow group bg-white h-full flex flex-col">
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                                        <BookOpen className="w-5 h-5" />
                                                    </div>
                                                    <Badge className="bg-indigo-500/10 text-indigo-600 border-none font-bold">Rasmiy</Badge>
                                                </div>
                                                <CardTitle className="text-lg font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">{lesson.title}</CardTitle>
                                                <CardDescription className="font-bold text-xs text-muted-foreground uppercase tracking-wider">{lesson.teacher}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6 pt-4 mt-auto">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">O'quvchilar</p>
                                                        <p className="text-xl font-black text-foreground flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-indigo-500" />
                                                            {lesson.studentCount}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1 text-right">
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">O'zlashtirish</p>
                                                        <p className="text-xl font-black text-indigo-600">{lesson.avgScore}%</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Progress value={lesson.avgScore} className="h-1.5 bg-muted" />
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    className="w-full rounded-2xl font-black text-xs h-10 bg-indigo-50/50 hover:bg-indigo-50 group/btn text-indigo-700"
                                                    onClick={() => {
                                                        setSelectedLesson(lesson);
                                                        setIsLessonModalOpen(true);
                                                    }}
                                                >
                                                    Tafsilotlar
                                                    <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="teacher_courses" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {teacherClassesStats?.map((course) => (
                                    <motion.div key={course._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                        <Card className="rounded-[2.5rem] border-border overflow-hidden hover:shadow-xl transition-shadow group bg-white h-full flex flex-col">
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                                        <GraduationCap className="w-5 h-5" />
                                                    </div>
                                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold">Kurs</Badge>
                                                </div>
                                                <CardTitle className="text-lg font-black text-foreground group-hover:text-emerald-600 transition-colors line-clamp-1">{course.title}</CardTitle>
                                                <CardDescription className="font-bold text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                    <UserCheck className="w-3 h-3" />
                                                    O'qituvchi: {course.teacher}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6 pt-4 mt-auto">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Talabalar</p>
                                                        <p className="text-xl font-black text-foreground flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-emerald-500" />
                                                            {course.studentCount}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1 text-right">
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Darslar</p>
                                                        <p className="text-xl font-black text-emerald-600">{course.totalLessons}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                                                        O'zlashtirish
                                                    </span>
                                                    <span className="text-sm font-black text-foreground">{course.averageMastery}%</span>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    className="w-full rounded-2xl font-black text-xs h-10 bg-emerald-50/50 hover:bg-emerald-50 group/btn text-emerald-700"
                                                    onClick={() => {
                                                        setSelectedCourse(course);
                                                        setIsCourseModalOpen(true);
                                                    }}
                                                >
                                                    Tafsilotlar
                                                    <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="teachers" className="space-y-6">
                            <Card className="rounded-[2.5rem] border-border overflow-hidden bg-white shadow-sm">
                                <div className="p-8 border-b border-border flex items-center justify-between">
                                    <h2 className="text-xl font-black flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary" />
                                        O'qituvchilar reytingi
                                    </h2>
                                    <div className="relative">
                                        <Button 
                                            variant="outline" 
                                            className="rounded-xl font-bold flex items-center gap-2 border-primary/20 hover:bg-primary/5 active:scale-95 transition-all"
                                            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                                        >
                                            <Download className="w-4 h-4 text-primary" />
                                            Eksport
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${exportDropdownOpen ? 'rotate-180' : ''}`} />
                                        </Button>
                                        
                                        <AnimatePresence>
                                            {exportDropdownOpen && (
                                                <>
                                                    <div 
                                                        className="fixed inset-0 z-10" 
                                                        onClick={() => setExportDropdownOpen(false)}
                                                    />
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-2xl shadow-xl py-2 z-20 overflow-hidden"
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                handleExport('pdf');
                                                                setExportDropdownOpen(false);
                                                            }}
                                                            className="w-full px-4 py-3 text-left text-sm font-bold text-foreground hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                                                        >
                                                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                            PDF Hujjat (.pdf)
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleExport('excel');
                                                                setExportDropdownOpen(false);
                                                            }}
                                                            className="w-full px-4 py-3 text-left text-sm font-bold text-foreground hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                                                        >
                                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                            Excel Jadval (.xlsx)
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleExport('word');
                                                                setExportDropdownOpen(false);
                                                            }}
                                                            className="w-full px-4 py-3 text-left text-sm font-bold text-foreground hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                                                        >
                                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                            Word Hujjat (.doc)
                                                        </button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-muted/30 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                <th className="px-8 py-5">O'qituvchi</th>
                                                <th className="px-8 py-5 text-center">Kurslar</th>
                                                <th className="px-8 py-5 text-center">O'quvchilar</th>
                                                <th className="px-8 py-5 text-center">O'zlashtirish</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {stats.teacherStats?.map((teacher) => (
                                                <tr key={teacher._id} className="hover:bg-muted/10 transition-colors">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                                                                {teacher.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-foreground">{teacher.name}</p>
                                                                <p className="text-xs text-muted-foreground font-medium">{teacher.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 font-black text-foreground text-center">{teacher.courseCount}</td>
                                                    <td className="px-8 py-5 font-black text-foreground text-center">{teacher.totalStudents}</td>
                                                    <td className="px-8 py-5 text-center">
                                                        <Badge className="bg-emerald-500 text-white font-black px-3 py-1 rounded-lg">
                                                            {teacher.averageMastery}%
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Modals */}
                <DetailModal 
                    isOpen={isLessonModalOpen} 
                    setIsOpen={setIsLessonModalOpen} 
                    title={selectedLesson?.title}
                    studentDetails={selectedLesson?.studentDetails}
                    type="lesson"
                />

                <DetailModal 
                    isOpen={isCourseModalOpen} 
                    setIsOpen={setIsCourseModalOpen} 
                    title={selectedCourse?.title}
                    studentDetails={selectedCourse?.studentDetails}
                    type="course"
                />
            </div>
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
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="p-8 border-b border-border flex items-center justify-between bg-muted/5">
                    <div>
                        <h2 className="text-2xl font-black text-foreground">{title}</h2>
                        <p className="text-sm font-medium text-muted-foreground">O'quvchilar natijalari va faolligi</p>
                    </div>
                    <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-full w-10 h-10 p-0">✕</Button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {!studentDetails || studentDetails.length === 0 ? (
                        <div className="text-center py-20 space-y-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                <Users className="w-8 h-8" />
                            </div>
                            <p className="font-bold text-muted-foreground">Hali hech qanday o'quvchi ma'lumoti yo'q</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 flex flex-col items-center justify-center">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Jami o'quvchilar</p>
                                    <p className="text-3xl font-black text-indigo-700">{studentDetails.length}</p>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-emerald-50/50 border border-emerald-100 flex flex-col items-center justify-center">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">O'rtacha natija</p>
                                    <p className="text-3xl font-black text-emerald-700">
                                        {Math.round(studentDetails.reduce((acc, s) => acc + (type === 'lesson' ? (s.quizScore || 0) : s.overall), 0) / studentDetails.length)}%
                                    </p>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-amber-50/50 border border-amber-100 flex flex-col items-center justify-center">
                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Faoliyat</p>
                                    <p className="text-3xl font-black text-amber-700">{Math.round(studentDetails.filter(s => (type === 'lesson' ? s.quizScore !== null : s.progress > 0)).length / studentDetails.length * 100)}%</p>
                                </div>
                            </div>

                            <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-muted/30 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            <th className="px-6 py-4">O'quvchi</th>
                                            {type === 'lesson' ? (
                                                <>
                                                    <th className="px-6 py-4 text-center">Ko'rilgan vaqt</th>
                                                    <th className="px-6 py-4 text-center">Quiz Natijasi</th>
                                                    <th className="px-6 py-4 text-center">Holat</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th className="px-6 py-4 text-center">Progress</th>
                                                    <th className="px-6 py-4 text-center">Quiz O'rtacha</th>
                                                    <th className="px-6 py-4 text-center">Topshiriqlar</th>
                                                    <th className="px-6 py-4 text-center">Umumiy</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {studentDetails.map((student) => (
                                            <tr key={student._id} className="hover:bg-muted/5 transition-colors group cursor-pointer">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-foreground">{student.name}</p>
                                                            <p className="text-[10px] text-muted-foreground font-medium">{student.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                {type === 'lesson' ? (
                                                    <>
                                                        <td className="px-6 py-4 text-center text-xs font-medium text-muted-foreground">
                                                            {new Date(student.viewedAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`font-black ${student.quizScore !== null ? 'text-indigo-600' : 'text-muted-foreground/30'}`}>
                                                                {student.quizScore !== null ? `${student.quizScore}%` : '-'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <Badge className={student.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 border-none' : 'bg-amber-500/10 text-amber-600 border-none'}>
                                                                {student.status === 'completed' ? 'Tugatdi' : 'Ko\'rdi'}
                                                            </Badge>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className="text-xs font-black">{student.progress}%</span>
                                                                <Progress value={student.progress} className="h-1 w-12 bg-muted" />
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-xs font-black text-indigo-600">{student.avgQuiz}%</td>
                                                        <td className="px-6 py-4 text-center text-xs font-black text-emerald-600">{student.avgAssignment}%</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <Badge className="bg-primary/10 text-primary border-none font-black">
                                                                {student.overall}%
                                                            </Badge>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="p-8 border-t border-border bg-muted/5 flex justify-end">
                    <Button onClick={() => setIsOpen(false)} className="rounded-2xl font-bold px-8">Yopish</Button>
                </div>
            </motion.div>
        </div>
    );
};

export default SuperAdminDashboard;
