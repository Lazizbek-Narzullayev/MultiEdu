import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Trophy, 
  ChevronRight, 
  ChevronLeft,
  Timer,
  BookOpen,
  Send,
  RotateCcw
} from 'lucide-react';

import { getQuizDetail, submitQuiz } from '../../store/Slice/quizSlice';
import NavbarWithDrawer from '../../Components/NavDrawer';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import Swal from 'sweetalert2';

const QuizViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentQuiz, loading, error } = useSelector(state => state.quizzes);
    const { user } = useSelector(state => state.auth);

    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        dispatch(getQuizDetail(id));
    }, [dispatch, id]);

    const handleOptionChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: parseInt(value)
        }));
    };

    const handleSubmit = async () => {
        if (!currentQuiz) return;

        const answeredCount = Object.keys(answers).length;
        const totalCount = currentQuiz.questions.length;

        if (answeredCount < totalCount) {
            const res = await Swal.fire({
                title: "Diqqat!",
                text: "Siz hali barcha savollarga javob bermadingiz. Testni baribir yakunlashni xohlaysizmi?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ha, yakunlash",
                cancelButtonText: "Yo'q, davom ettirish",
                background: "#1e293b",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
                cancelButtonColor: "#64748b"
            });
            if (!res.isConfirmed) return;
        }

        setSubmitting(true);
        const formattedAnswers = Object.keys(answers).map(qId => ({
            questionId: qId,
            selectedOptionIndex: answers[qId]
        }));

        const resultAction = await dispatch(submitQuiz({ id, answers: formattedAnswers }));
        if (!resultAction.error) {
            setResultData(resultAction.payload);
        }
        setSubmitting(false);
    };

    if (loading && !currentQuiz) {
        return (
            <NavbarWithDrawer>
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </NavbarWithDrawer>
        );
    }

    if (error) {
        return (
            <NavbarWithDrawer>
                <div className="max-w-md mx-auto mt-20 text-center space-y-6 p-8 bg-card border border-border rounded-3xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold">Xatolik yuz berdi</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={() => navigate(-1)} className="rounded-2xl">Orqaga qaytish</Button>
                </div>
            </NavbarWithDrawer>
        );
    }

    if (!currentQuiz) return null;

    const totalQuestions = currentQuiz.questions.length;
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / totalQuestions) * 100;
    const scorePercentage = resultData ? (resultData.score / resultData.totalQuestions) * 100 : 0;
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];

    return (
        <NavbarWithDrawer>
            <div className="min-h-screen bg-background pb-20">
                {/* Quiz Header */}
                <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-xl bg-card/80">
                    <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="font-black text-foreground line-clamp-1">{currentQuiz.title}</h1>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {totalQuestions} ta savol
                                </p>
                            </div>
                        </div>

                        {!resultData && (
                            <div className="flex items-center gap-6">
                                <div className="hidden md:flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                        Jarayon: {answeredCount}/{totalQuestions}
                                    </span>
                                    <Progress value={progress} className="w-32 h-1.5 bg-muted" />
                                </div>
                                <Button 
                                    className="rounded-xl bg-primary px-6 font-bold" 
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                >
                                    {submitting ? "..." : "Tugatish"}
                                </Button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 py-10">
                    <AnimatePresence mode="wait">
                        {resultData ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="bg-card border-2 border-border rounded-[3rem] p-8 md:p-16 text-center space-y-10 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                                
                                <div className="relative">
                                    <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 transform -rotate-6 ${
                                        scorePercentage >= 80 ? 'bg-amber-500 text-white rotate-6' : 'bg-primary text-white'
                                    } shadow-2xl shadow-primary/20`}>
                                        {scorePercentage >= 80 ? <Trophy className="w-16 h-16" /> : <CheckCircle2 className="w-16 h-16" />}
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
                                            {scorePercentage >= 80 ? 'Ajoyib natija!' : 'Yaxshi harakat!'}
                                        </h2>
                                        <p className="text-xl text-muted-foreground font-medium">
                                            Siz {resultData.totalQuestions} tadan {resultData.score} ta to'g'ri javob berdingiz
                                        </p>
                                    </div>

                                    <div className="max-w-md mx-auto pt-10">
                                        <div className="flex items-center justify-between mb-4 font-black text-xs uppercase tracking-widest text-muted-foreground">
                                            <span>Muvaffaqiyat</span>
                                            <span>{Math.round(scorePercentage)}%</span>
                                        </div>
                                        <Progress value={scorePercentage} className="h-4 rounded-full bg-muted" />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
                                        <Button 
                                            size="lg" 
                                            className="rounded-2xl px-10 font-black text-lg bg-primary"
                                            onClick={() => navigate(`/courses/${currentQuiz.course?._id || currentQuiz.course}`)}
                                        >
                                            Kursga qaytish
                                        </Button>
                                        <Button 
                                            size="lg" 
                                            variant="outline" 
                                            className="rounded-2xl px-10 font-black text-lg border-2"
                                            onClick={() => window.location.reload()}
                                        >
                                            <RotateCcw className="w-5 h-5 mr-2" />
                                            Qayta topshirish
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key={currentQuestionIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl">
                                            {currentQuestionIndex + 1}
                                        </div>
                                        <Badge variant="outline" className="border-primary/20 text-primary font-bold">
                                            SAVOL
                                        </Badge>
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight mb-10">
                                        {currentQuestion.questionText}
                                    </h2>

                                    <div className="grid gap-4">
                                        {currentQuestion.options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleOptionChange(currentQuestion._id, idx)}
                                                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 group ${
                                                    answers[currentQuestion._id] === idx
                                                        ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5'
                                                        : 'bg-card border-border hover:border-primary/30 hover:bg-muted/30'
                                                }`}
                                            >
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                    answers[currentQuestion._id] === idx
                                                        ? 'border-primary bg-primary text-white'
                                                        : 'border-border group-hover:border-primary/50'
                                                }`}>
                                                    {answers[currentQuestion._id] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                                <span className={`text-lg font-bold transition-colors ${
                                                    answers[currentQuestion._id] === idx ? 'text-primary' : 'text-foreground'
                                                }`}>
                                                    {option}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <Button 
                                        variant="outline" 
                                        size="lg" 
                                        className="rounded-2xl px-8 font-bold border-2"
                                        disabled={currentQuestionIndex === 0}
                                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                    >
                                        <ChevronLeft className="w-5 h-5 mr-2" />
                                        Oldingi
                                    </Button>

                                    {currentQuestionIndex < totalQuestions - 1 ? (
                                        <Button 
                                            size="lg" 
                                            className="rounded-2xl px-8 font-bold bg-primary shadow-xl shadow-primary/20"
                                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                        >
                                            Keyingisi
                                            <ChevronRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    ) : (
                                        <Button 
                                            size="lg" 
                                            className="rounded-2xl px-10 font-black bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20"
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                        >
                                            <Send className="w-5 h-5 mr-2" />
                                            Yakunlash
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </NavbarWithDrawer>
    );
};

export default QuizViewer;
