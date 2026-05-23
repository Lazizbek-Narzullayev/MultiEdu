import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { login, telegramLogin } from '../../store/Slice/authSlice';
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
  Sparkles,
  Zap
} from 'lucide-react';

const LogIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = await dispatch(login({ email, password }));
    if (login.fulfilled.match(action)) {
      const userRole = action.payload.role;
      if (userRole === 'student') {
        navigate("/student-dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      Swal.fire({ 
        icon: 'error', 
        title: t('login_failed', 'Login Failed!'), 
        text: action.payload || t('invalid_credentials', "Invalid credentials"), 
        confirmButtonColor: '#7c3aed' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] flex overflow-hidden font-sans">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md space-y-10"
        >
          {/* Logo Section */}
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-[1rem] bg-primary flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-[#1e293b] tracking-tight">
              MultiEdu
            </span>
          </Link>

          <div className="space-y-2">
            <h1 className="text-4xl font-black text-[#1e293b] tracking-tight leading-tight">
              {t('login_title', 'Xush kelibsiz!')}
            </h1>
            <p className="text-[#64748b] font-medium text-lg">
              {t('login_subtitle', 'O\'qishni davom ettirish uchun profilingizga kiring.')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-[11px] font-black uppercase text-[#94a3b8] tracking-widest ml-1">{t('email_label', 'Elektron pochta')}</Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-5 h-5 text-[#94a3b8] group-focus-within:text-primary transition-colors" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('email_placeholder', 'email@example.com')}
                  className="pl-12 h-14 bg-white border-2 border-[#e2e8f0] focus:border-primary rounded-[1.25rem] shadow-sm font-medium transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[11px] font-black uppercase text-[#94a3b8] tracking-widest ml-1">{t('password_label', 'Parol')}</Label>
                <Link to="/forgot-password" size="sm" className="text-xs text-primary font-bold hover:underline">
                  {t('forgot_password', 'Parolni unutdingizmi?')}
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-[#94a3b8] group-focus-within:text-primary transition-colors" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-14 bg-white border-2 border-[#e2e8f0] focus:border-primary rounded-[1.25rem] shadow-sm font-medium transition-all"
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
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-[1.25rem] font-black shadow-xl shadow-primary/20 text-lg group transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t('submit', 'Tizimga kirish')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="space-y-4">
            <p className="text-center text-[#64748b] font-bold text-sm">
                {t('no_account', 'Hali ro\'yxatdan o\'tmaganmisiz?')}{" "}
                <Link to="/signup" className="text-primary hover:underline ml-1">
                {t('create_account', 'Hisob yarating')}
                </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Decorative Premium Panel */}
      <div className="hidden lg:flex flex-1 bg-[#1e293b] relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 w-full flex flex-col items-center justify-center p-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-12"
          >
            <div className="relative inline-block">
                <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full" />
                <div className="relative w-24 h-24 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center mx-auto shadow-2xl">
                    <Sparkles className="w-12 h-12 text-primary" />
                </div>
            </div>
            
            <div className="space-y-6">
                <h2 className="text-5xl font-black text-white leading-tight tracking-tight">
                    Raqamli texnologiyalar va <span className="text-primary">innovatsiyalar</span>
                </h2>
                <p className="text-slate-400 text-xl font-medium max-w-lg mx-auto leading-relaxed">
                    AI Tutor, 3D vizualizatsiya va eng zamonaviy kurslar bilan kelajakni bugundan yarating.
                </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { label: "150+ Darslar", icon: Zap },
                    { label: "24/7 AI Yordam", icon: Sparkles },
                    { label: "3D Modellar", icon: GraduationCap },
                    { label: "Sertifikat", icon: Lock },
                ].map((f, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex items-center gap-3 text-left"
                    >
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                            <f.icon className="w-4 h-4" />
                        </div>
                        <span className="text-white font-bold text-xs">{f.label}</span>
                    </motion.div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* Floating gradient circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      </div>
    </div>
  );
};

export default LogIn;
