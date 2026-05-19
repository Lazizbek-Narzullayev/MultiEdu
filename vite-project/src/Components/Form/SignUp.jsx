import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../store/Slice/authSlice';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  Send,
  User,
  BookOpen,
  Users,
  Sparkles,
  Zap,
  CheckCircle2,
  Trophy
} from 'lucide-react';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.auth);

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const action = await dispatch(signup({ name, email, password, role }));
    if (signup.fulfilled.match(action)) {
      Swal.fire({
        title: t('success', 'Muvaffaqiyatli'),
        text: `${role === 'teacher' ? t('teacher_role', 'O\'qituvchi') : t('student_role', 'Talaba')} sifatidaro'yxatdan o'tdingiz!`,
        icon: 'success',
        confirmButtonColor: '#7c3aed'
      });
      navigate('/');
    } else {
      Swal.fire({
        title: t('error', 'Xato'),
        text: action.payload || t('signup_error', "Ro'yxatdan o'tishda xatolik"),
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] flex font-sans">
      {/* Left Side - Branding & Visuals */}
      <div className="hidden lg:flex flex-1 relative bg-[#7c3aed] overflow-hidden items-center justify-center p-20">
        {/* Animated Background Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        
        <div className="relative z-10 max-w-lg w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-12 text-white"
          >
            {/* Logo area */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/30">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-black tracking-tight">MultiEdu</h1>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl font-black leading-[1.1] tracking-tight">
                Bilim sari <br /> <span className="text-white/70 italic">ilk qadam.</span>
              </h2>
              <p className="text-xl text-white/80 font-medium leading-relaxed">
                Zamonaviy va interaktiv ta'lim platformasi bilan kelajak kasblarini bugundan egallang.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Sparkles, text: "AI Yordamchi" },
                { icon: Zap, text: "Tezkor Progress" },
                { icon: CheckCircle2, text: "Sifatli Ta'lim" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <item.icon className="w-5 h-5" />
                  <span className="font-black text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/10">
              {[
                { val: "5k+", label: "O'quvchilar" },
                { val: "200+", label: "Darsliklar" },
                { val: "98%", label: "Muvaffaqiyat" }
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-black">{stat.val}</p>
                  <p className="text-sm font-bold text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-[0.8] flex flex-col justify-center items-center p-8 sm:p-20 bg-white relative overflow-hidden">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-[#1e293b]">MultiEdu</span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-10"
        >
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-[#1e293b] tracking-tight">Hisob yaratish</h2>
            <p className="text-[#64748b] text-lg font-medium">O'rganishni bugundan boshlang</p>
          </div>

          {/* Role Tabs */}
          <div className="bg-[#f8fafc] p-1.5 rounded-[1.5rem] flex gap-2 border border-[#f1f5f9]">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all ${
                role === 'student' 
                  ? 'bg-white text-primary shadow-xl shadow-primary/10' 
                  : 'text-[#64748b] hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Talaba
            </button>
            <button
              onClick={() => setRole('teacher')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all ${
                role === 'teacher' 
                  ? 'bg-white text-primary shadow-xl shadow-primary/10' 
                  : 'text-[#64748b] hover:bg-white/50'
              }`}
            >
              <Users className="w-5 h-5" />
              O'qituvchi
            </button>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-[#94a3b8] tracking-widest ml-1">To'liq ism</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8] group-focus-within:text-primary transition-colors" />
                <Input
                  className="h-14 pl-12 rounded-2xl border-2 border-[#f1f5f9] focus:border-primary bg-[#f8fafc] font-bold transition-all"
                  placeholder="Abdurahmon Toshmatov"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-[#94a3b8] tracking-widest ml-1">Email manzilingiz</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8] group-focus-within:text-primary transition-colors" />
                <Input
                  className="h-14 pl-12 rounded-2xl border-2 border-[#f1f5f9] focus:border-primary bg-[#f8fafc] font-bold transition-all"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-[#94a3b8] tracking-widest ml-1">Maxfiy parol</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8] group-focus-within:text-primary transition-colors" />
                <Input
                  type={showPassword ? "text" : "password"}
                  className="h-14 pl-12 pr-12 rounded-2xl border-2 border-[#f1f5f9] focus:border-primary bg-[#f8fafc] font-bold transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-[1.25rem] font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Ro'yxatdan o'tish
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

           <p className="text-center text-[#64748b] font-bold">
            Hisobingiz bormi?{" "}
            <Link to="/login" className="text-primary hover:underline">Kirish</Link>
          </p>
        </motion.div>

        {/* Footer info */}
        <div className="absolute bottom-8 text-center">
          <p className="text-[10px] font-black text-[#cbd5e1] uppercase tracking-[0.2em]">© 2026 MultiEdu Premium Learning</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
