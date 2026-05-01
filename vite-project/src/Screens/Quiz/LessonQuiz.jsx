import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, Send, MessageCircle, AlertCircle, BookOpen
} from 'lucide-react';

import NavbarWithDrawer from '../../Components/NavDrawer';
import { Button } from '@/Components/ui/button';
import { API_BASE_URL } from '../../config/apiConfig';
import Swal from 'sweetalert2';

const LessonQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);

    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [quizResult, setQuizResult] = useState(null);

    // Standard browser warning for leaving page
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!quizResult) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [quizResult]);

    useEffect(() => {
        fetchLesson();
    }, [id]);

    const fetchLesson = async () => {
        try {
            setLoading(true);
            const headers = user?.token ? { 'x-auth-token': user.token } : {};
            const res = await axios.get(`${API_BASE_URL}/lessons/${id}`, { headers });
            setLesson(res.data);
        } catch (err) {
            console.error('Error fetching lesson:', err);
            Swal.fire({
                icon: 'error',
                title: 'Xatolik',
                text: 'Test ma\'lumotlarini yuklashda xatolik yuz berdi.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOptionChange = (idx) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: idx }));
    };

    const markAsViewed = async () => {
        try {
            if(user && user.token) {
                await axios.post(`${API_BASE_URL}/lessons/${id}/view`, {}, {
                    headers: { 'x-auth-token': user.token }
                });
            }
        } catch(err) {}
    };

    const handleSubmit = async () => {
        if (!lesson || !lesson.quiz) return;

        const totalQuestions = lesson.quiz.length;
        const answeredCount = Object.keys(answers).length;

        if (answeredCount < totalQuestions) {
            const res = await Swal.fire({
                title: "Diqqat!",
                text: "Siz hali barcha savollarga javob bermadingiz. Testni baribir yakunlashni xohlaysizmi?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ha, yakunlash",
                cancelButtonText: "Yo'q, davom ettirish",
            });
            if (!res.isConfirmed) return;
        }

        setSubmitting(true);
        let correct = 0;
        lesson.quiz.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) correct++;
        });
        const score = (correct / totalQuestions) * 100;
        
        // Pass condition: All questions must be answered AND score >= 80%
        const isPassed = (answeredCount === totalQuestions) && (score >= 80);

        try {
            if (isPassed) {
                // Submit quiz result to backend if endpoint exists
                try {
                    await axios.post(`${API_BASE_URL}/quiz-results`, {
                        lessonId: id, 
                        courseId: lesson.course?._id || lesson.course,
                        score: Math.round(score), 
                        totalQuestions: totalQuestions, 
                        correctAnswers: correct
                    }, { headers: { 'x-auth-token': user.token } });
                } catch (e) {
                    // Ignore if endpoint doesn't exist
                }
                
                // Mark lesson as viewed since quiz is passed
                await markAsViewed();
                
                setQuizResult({ score, correct, total: totalQuestions, passed: true });
                Swal.fire({ icon: 'success', title: 'Ajoyib!', text: `Siz ${Math.round(score)}% natija bilan o'tdingiz.` });
            } else {
                setQuizResult({ score, correct, total: totalQuestions, passed: false });
                Swal.fire({ icon: 'error', title: 'Yetersiz natija', text: `Natija: ${Math.round(score)}%. Kamida 80% kerak.` });
            }
        } catch (err) {
            console.error("Error submitting quiz", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEarlySubmit = async () => {
        setSubmitting(true);
        const totalQuestions = lesson.quiz.length;
        let correct = 0;
        lesson.quiz.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) correct++;
        });
        const score = (correct / totalQuestions) * 100;

        try {
            // Early submit never passes because not all questions are answered
            setQuizResult({ score, correct, total: totalQuestions, passed: false });
            Swal.fire({ icon: 'error', title: 'Test to\'xtatildi', text: `Natija: ${Math.round(score)}%. O'tish uchun barcha savollarni ishlash va kamida 80% to'plash kerak.` });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <NavbarWithDrawer>
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </NavbarWithDrawer>
        );
    }

    if (!lesson || !lesson.quiz || lesson.quiz.length === 0) {
        return (
            <NavbarWithDrawer>
                <div className="max-w-md mx-auto mt-20 text-center space-y-6 p-8 bg-card border border-border rounded-3xl">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold">Test topilmadi</h2>
                    <p className="text-muted-foreground">Ushbu dars uchun test mavjud emas.</p>
                    <Button onClick={() => navigate(-1)} className="rounded-2xl">Darsga qaytish</Button>
                </div>
            </NavbarWithDrawer>
        );
    }

    const currentQuestion = lesson.quiz[currentQuestionIndex];
    const totalQuestions = lesson.quiz.length;
    const answeredCount = Object.keys(answers).length;

    // Helper for alphabet labels
    const getOptionLabel = (index) => String.fromCharCode(65 + index);

    return (
        <NavbarWithDrawer>
            <div className="min-h-screen bg-white dark:bg-background pb-20">

                <main className="max-w-4xl mx-auto px-4 py-8">
                    
                    {/* Header Area */}
                    <div className="mb-10 text-center space-y-3">
                        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-secondary text-sm font-bold text-muted-foreground mb-2">
                            Modul {lesson.module || "1"}: {lesson.course?.title || "Kurs"}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-foreground">
                            Dars yakuni testi: {lesson.title}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm font-medium mt-4">
                            <span>Savol {currentQuestionIndex + 1} / {totalQuestions}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-secondary rounded-full h-1.5 mb-10 overflow-hidden">
                        <div 
                            className="bg-primary h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {quizResult ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-card border border-border rounded-3xl p-10 text-center shadow-sm max-w-2xl mx-auto"
                            >
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                                    quizResult.passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                    {quizResult.passed ? <CheckCircle2 className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                                </div>
                                <h2 className="text-3xl font-black mb-4">
                                    {quizResult.passed ? "Siz testdan muvaffaqiyatli o'tdingiz!" : "Afsuski, yetarli ball to'play olmadingiz."}
                                </h2>
                                <p className="text-xl text-muted-foreground mb-8">
                                    Natija: <span className={`font-bold ${quizResult.passed ? 'text-emerald-500' : 'text-red-500'}`}>{Math.round(quizResult.score)}%</span> ({quizResult.total} tadan {quizResult.correct} ta)
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    {!quizResult.passed && (
                                        <Button 
                                            variant="outline"
                                            size="lg"
                                            className="rounded-2xl"
                                            onClick={() => {
                                                setAnswers({});
                                                setCurrentQuestionIndex(0);
                                                setQuizResult(null);
                                            }}
                                        >
                                            Qayta urinib ko'rish
                                        </Button>
                                    )}
                                    <Button 
                                        size="lg"
                                        className="rounded-2xl bg-primary"
                                        onClick={() => navigate(`/lessons/${id}`)}
                                    >
                                        Darsga qaytish
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key={currentQuestionIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-card border border-border rounded-[2rem] p-6 md:p-10 shadow-sm"
                            >
                                <h2 className="text-xl md:text-2xl font-bold text-foreground leading-relaxed mb-8 text-center px-4">
                                    {currentQuestion.question}
                                </h2>

                                <div className="grid gap-4 max-w-3xl mx-auto">
                                    {currentQuestion.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionChange(idx)}
                                            className={`w-full text-left p-4 md:p-5 rounded-2xl border transition-all duration-200 flex items-center gap-4 group ${
                                                answers[currentQuestionIndex] === idx
                                                    ? 'bg-primary/5 border-primary shadow-[0_0_0_1px_rgba(var(--primary),1)]'
                                                    : 'bg-card border-border hover:border-primary/40 hover:bg-muted/30'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${
                                                answers[currentQuestionIndex] === idx
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-muted-foreground/30 text-muted-foreground group-hover:border-primary/50'
                                            }`}>
                                                {getOptionLabel(idx)}
                                            </div>
                                            <span className={`text-base md:text-lg font-medium transition-colors ${
                                                answers[currentQuestionIndex] === idx ? 'text-foreground' : 'text-foreground/80'
                                            }`}>
                                                {option}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Navigation inside Card */}
                                <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
                                    <Button 
                                        variant="ghost" 
                                        className="rounded-xl px-6 font-medium text-muted-foreground hover:text-foreground"
                                        disabled={currentQuestionIndex === 0}
                                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                    >
                                        <ChevronLeft className="w-5 h-5 mr-1" />
                                        Oldingisi
                                    </Button>

                                    {currentQuestionIndex < totalQuestions - 1 ? (
                                        <Button 
                                            className="rounded-xl px-8 font-bold bg-indigo-400 hover:bg-indigo-500 text-white"
                                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                        >
                                            Keyingi savol
                                            <ChevronRight className="w-5 h-5 ml-1" />
                                        </Button>
                                    ) : (
                                        <Button 
                                            className="rounded-xl px-8 font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Testni yakunlash
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Helper Cards below Quiz */}
                    {!quizResult && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            <div className="bg-card border border-border p-5 rounded-2xl flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">Yordam kerakmi?</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        AI Tutor savollarga tushuntirish berishi mumkin.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-card border border-border p-5 rounded-2xl flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">E'tiborli bo'ling</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Har bir savol uchun faqat bitta to'g'ri javob mavjud.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-card border border-border p-5 rounded-2xl flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">Materiallarni ko'ring</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Savollar dars mazmuniga to'liq mos keladi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Footer text */}
                    <div className="text-center mt-12 mb-4">
                        <p className="text-xs text-muted-foreground">
                            © 2026 MultiEdu Learner. Test davomida global navigatsiya cheklangan.
                        </p>
                    </div>

                </main>
            </div>
        </NavbarWithDrawer>
    );
};

export default LessonQuiz;
