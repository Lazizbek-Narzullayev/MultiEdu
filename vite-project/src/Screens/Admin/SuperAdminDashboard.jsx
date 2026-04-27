import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  MoreVertical
} from 'lucide-react';

import { API_BASE_URL } from '../../config/apiConfig';
import NavbarWithDrawer from '../../Components/NavDrawer';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchStats();
        fetchRecentActivities();
    }, []);

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
            <div className="min-h-screen bg-white p-6 lg:p-10">
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
                            <Button className="rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-bold">
                                <Plus className="w-4 h-4 mr-2" />
                                Yangi Qo'shish
                            </Button>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                            title="Jami talabalar" 
                            value={stats.global.totalStudents} 
                            icon={Users} 
                            color="from-blue-500 to-indigo-600"
                            subText="+12% o'tgan haftadan"
                        />
                        <StatCard 
                            title="O'qituvchilar" 
                            value={stats.global.totalTeachers} 
                            icon={UserCheck} 
                            color="from-emerald-500 to-teal-600"
                            subText="+3 yangi o'qituvchi"
                        />
                        <StatCard 
                            title="Faol kurslar" 
                            value={stats.global.totalCourses} 
                            icon={BookOpen} 
                            color="from-amber-500 to-orange-600"
                            subText="4 ta yangi kurs"
                        />
                        <StatCard 
                            title="Tizim o'zlashtirishi" 
                            value={`${stats.global.averageMastery || 0}%`} 
                            icon={BarChart3} 
                            color="from-primary to-accent"
                            subText="O'rtacha ko'rsatkich"
                        />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* System Health */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-8">
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
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-black uppercase tracking-wider text-muted-foreground">
                                            <span className="flex items-center gap-2"><Cloud className="w-3 h-3" /> Server storage</span>
                                            <span className="text-foreground">64%</span>
                                        </div>
                                        <Progress value={64} className="h-2 bg-muted" />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-muted-foreground">Uptime</span>
                                        <Badge variant="success" className="rounded-lg">99.9%</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-muted-foreground">Oxirgi Backup</span>
                                        <span className="text-sm font-bold text-foreground">Bugun, 04:00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity & Management */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                                <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
                                    <h2 className="text-xl font-black flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-primary" />
                                        So'nggi faoliyatlar
                                    </h2>
                                    <Button variant="ghost" size="sm" className="font-bold">Barchasi</Button>
                                </div>
                                <div className="p-0">
                                    <div className="divide-y divide-border">
                                        {recentActivities.map((act, index) => (
                                            <div key={index} className="p-6 flex items-center gap-6 hover:bg-muted/30 transition-colors group">
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
                                                    <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Teachers Monitoring */}
                            <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                                <div className="p-8 border-b border-border flex items-center justify-between">
                                    <h2 className="text-xl font-black flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-primary" />
                                        O'qituvchilar Monitoringi
                                    </h2>
                                    <Button variant="outline" className="rounded-xl font-bold">Hisobot</Button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-muted/20 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                <th className="px-8 py-4">O'qituvchi</th>
                                                <th className="px-8 py-4">Kurslar</th>
                                                <th className="px-8 py-4">O'quvchilar</th>
                                                <th className="px-8 py-4">Reyting</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {stats.teacherStats?.map((teacher) => (
                                                <tr key={teacher._id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-8 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black">
                                                                {teacher.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-foreground">{teacher.name}</p>
                                                                <p className="text-xs text-muted-foreground">{teacher.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-4 font-bold text-foreground">{teacher.courseCount}</td>
                                                    <td className="px-8 py-4 font-bold text-foreground">{teacher.totalStudents}</td>
                                                    <td className="px-8 py-4">
                                                        <Badge variant="success" className="font-black">{teacher.averageMastery}%</Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NavbarWithDrawer>
    );
};

export default SuperAdminDashboard;
