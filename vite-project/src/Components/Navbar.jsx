import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/Slice/authSlice';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { 
  GraduationCap, 
  Menu, 
  X, 
  BookOpen, 
  LogOut, 
  User as UserIcon,
  LayoutDashboard
} from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm" 
            : "bg-background/50 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  Multi<span className="text-primary">Edu</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link
                to="/"
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-secondary ${
                  location.pathname === '/' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t('menu_home', 'Bosh sahifa')}
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/courses"
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-secondary ${
                      location.pathname === '/courses' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t('menu_my_courses', 'Kurslarim')}
                  </Link>
                  <Link
                    to={user.role === 'student' ? '/student-dashboard' : '/dashboard'}
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-secondary ${
                      location.pathname.includes('dashboard') ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t('cabinet', 'Shaxsiy kabinet')}
                  </Link>
                </>
              )}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {!user ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      {t('login_btn', 'Kirish')}
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
                      {t('signup_btn', 'Ro\'yxatdan o\'tish')}
                    </Button>
                  </Link>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout', 'Chiqish')}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden"
          >
            <div className="bg-background/95 backdrop-blur-xl border-b border-border shadow-xl">
              <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">{t('menu_home', 'Bosh sahifa')}</span>
                </Link>
                
                {user && (
                  <>
                    <Link
                      to="/courses"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span className="font-medium">{t('menu_my_courses', 'Kurslarim')}</span>
                    </Link>
                    <Link
                      to={user.role === 'student' ? '/student-dashboard' : '/dashboard'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span className="font-medium">{t('cabinet', 'Shaxsiy kabinet')}</span>
                    </Link>
                  </>
                )}

                <div className="pt-4 space-y-2 border-t border-border mt-4">
                  {!user ? (
                    <>
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-center">
                          {t('login_btn', 'Kirish')}
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full justify-center bg-gradient-to-r from-primary to-primary/80">
                          {t('signup_btn', 'Ro\'yxatdan o\'tish')}
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Button 
                      variant="destructive" 
                      className="w-full justify-center gap-2"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      {t('logout', 'Chiqish')}
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Spacer to prevent content from being hidden under fixed navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;

