import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  Video, 
  Box as BoxIcon, 
  CheckCircle, 
  Upload, 
  Trash2, 
  Plus, 
  Save, 
  X,
  FileText,
  Music,
  Image as ImageIcon,
  Sparkles,
  Globe
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

import { addLesson, fetchLessonById, updateLesson } from '../../store/Slice/lessonSlice';
import { API_BASE_URL } from '../../config/apiConfig';
import Library3D from './Library3D';
import ModelViewer from './ModelViewer';
import NavbarWithDrawer from '../NavDrawer';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';

const TabWrapper = ({ children }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="space-y-8 pt-6"
    >
        {children}
    </motion.div>
);

const LessonForm = ({ courseId = null, onComplete = null }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.lessons);
    const { user } = useSelector((state) => state.auth);

    const { id } = useParams();
    const isEdit = !!id;
    const [activeTab, setActiveTab] = useState("general");
    const [selected3DModel, setSelected3DModel] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        textContent: '',
        videoUrl: '',
        audioUrl: '',
        interactiveUrl: '',
        documentUrl: '',
        thumbnailUrl: '',
        category: 'Umumiy',
        courseId: courseId,
        transcript: ''
    });

    const [quiz, setQuiz] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({
        video: 0,
        audio: 0,
        document: 0,
        thumbnail: 0
    });

    React.useEffect(() => {
        if (isEdit) {
            dispatch(fetchLessonById(id)).unwrap().then(lesson => {
                setFormData({
                    title: lesson.title || '',
                    description: lesson.description || '',
                    textContent: lesson.textContent || '',
                    videoUrl: lesson.videoUrl || '',
                    audioUrl: lesson.audioUrl || '',
                    interactiveUrl: lesson.interactiveUrl || '',
                    documentUrl: lesson.documentUrl || '',
                    thumbnailUrl: lesson.thumbnailUrl || '',
                    category: lesson.category || 'Umumiy',
                    courseId: lesson.course || courseId,
                    transcript: lesson.transcript || ''
                });
                setQuiz(lesson.quiz || []);
                setDocuments(lesson.documents || []);
            });
        }
    }, [id, isEdit, dispatch, courseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('type', type);

        try {
            setUploadProgress(prev => ({ ...prev, [type]: 10 }));
            const res = await axios.post(`${API_BASE_URL}/upload`, uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': user.token
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(prev => ({ ...prev, [type]: progress }));
                }
            });

            setFormData(prev => ({
                ...prev,
                [type === 'video' ? 'videoUrl' : type === 'audio' ? 'audioUrl' : type === 'thumbnail' ? 'thumbnailUrl' : 'documentUrl']: res.data.url
            }));
            Swal.fire({ icon: 'success', title: 'Yuklandi', timer: 1500, showConfirmButton: false });
        } catch (error) {
            Swal.fire('Xato', 'Fayl yuklashda xatolik', 'error');
        } finally {
            setUploadProgress(prev => ({ ...prev, [type]: 0 }));
        }
    };

    const handleDocumentFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('type', 'document');
        try {
            setUploadProgress(prev => ({ ...prev, document: 10 }));
            const res = await axios.post(`${API_BASE_URL}/upload`, uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': user.token },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(prev => ({ ...prev, document: progress }));
                }
            });
            const fileName = file.name.replace(/\.[^/.]+$/, '');
            setDocuments(prev => [...prev, { name: fileName, url: res.data.url }]);
            Swal.fire({ icon: 'success', title: 'Yuklandi', timer: 1500, showConfirmButton: false });
        } catch (error) {
            Swal.fire('Xato', 'Fayl yuklashda xatolik', 'error');
        } finally {
            setUploadProgress(prev => ({ ...prev, document: 0 }));
        }
    };

    const addManualDocument = () => {
        setDocuments(prev => [...prev, { name: 'Yangi hujjat', url: '' }]);
    };

    const handleTranslate = async () => {
        if (!formData.transcript.trim()) return;
        try {
            Swal.fire({ title: 'Tarjima qilinmoqda...', didOpen: () => Swal.showLoading() });
            const res = await axios.post(`${API_BASE_URL}/ai/translate`, { text: formData.transcript }, { headers: { 'x-auth-token': user.token } });
            const translatedText = res.data.candidates[0].content.parts[0].text;
            setFormData(prev => ({ ...prev, transcript: translatedText }));
            Swal.close();
        } catch (err) {
            Swal.fire('Xato', 'AI tarjima qila olmadi', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.textContent) {
            Swal.fire('Xato', 'Sarlavha va matn majburiy', 'error');
            return;
        }

        const lessonData = { ...formData, quiz, documents };
        let action;
        
        if (isEdit) {
            action = await dispatch(updateLesson({ id, lessonData }));
        } else {
            action = await dispatch(addLesson(lessonData));
        }

        if (isEdit ? updateLesson.fulfilled.match(action) : addLesson.fulfilled.match(action)) {
            Swal.fire({ 
                icon: 'success', 
                title: isEdit ? 'Dars yangilandi' : 'Dars yaratildi', 
                timer: 1500, 
                showConfirmButton: false 
            });
            if (onComplete) onComplete(action.payload);
            else navigate(courseId || formData.courseId ? `/courses/${courseId || formData.courseId}` : '/lessons');
        }
    };


    const formUI = (
        <div className="max-w-4xl mx-auto py-6 px-4">
            <div className="bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden">
                <div className="p-6 md:p-8 border-b border-border bg-muted/20">
                    <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">
                        {isEdit ? 'Darsni tahrirlang' : 'Yangi dars yarating'}
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        {isEdit ? 'Mavjud dars ma\'lumotlarini yangilash' : 'Interaktiv, multimodal va AI bilan boyitilgan ta\'lim tajribasi'}
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6 md:p-8">
                    <TabsList className="bg-muted/50 p-1 rounded-2xl w-full justify-start overflow-x-auto no-scrollbar">
                        <TabsTrigger value="general" className="rounded-xl px-6 font-bold"><Info className="w-4 h-4 mr-2" /> Asosiy</TabsTrigger>
                        <TabsTrigger value="media" className="rounded-xl px-6 font-bold"><Video className="w-4 h-4 mr-2" /> Media</TabsTrigger>
                        <TabsTrigger value="3d" className="rounded-xl px-6 font-bold"><BoxIcon className="w-4 h-4 mr-2" /> 3D & VR</TabsTrigger>
                        <TabsTrigger value="quiz" className="rounded-xl px-6 font-bold"><CheckCircle className="w-4 h-4 mr-2" /> Testlar</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general">
                        <TabWrapper>
                            <div className="grid gap-8">
                                <div className="space-y-4">
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Dars sarlavhasi</label>
                                    <input 
                                        name="title" value={formData.title} onChange={handleChange}
                                        className="w-full bg-muted/50 border border-border rounded-2xl p-4 text-xl font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="Masalan: Fotosintez jarayoni haqida asosiy tushunchalar"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Qisqacha tavsif</label>
                                    <textarea 
                                        name="description" value={formData.description} onChange={handleChange}
                                        className="w-full bg-muted/50 border border-border rounded-2xl p-4 min-h-[100px] focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="Darsning qisqacha mazmunini yozing..."
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Muqova rasmi</label>
                                        <div className="flex gap-2">
                                            <input 
                                                name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange}
                                                className="flex-1 bg-muted/50 border border-border rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                                                placeholder="Rasm URL"
                                            />
                                            <Button variant="outline" className="rounded-2xl h-auto px-6 border-2 group relative overflow-hidden">
                                                <Upload className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                Yuklash
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'thumbnail')} />
                                            </Button>
                                        </div>
                                        {uploadProgress.thumbnail > 0 && <Progress value={uploadProgress.thumbnail} className="h-1" />}
                                    </div>
                                    {formData.thumbnailUrl && (
                                        <div className="rounded-[2rem] border-2 border-border overflow-hidden h-40">
                                            <img src={formData.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Asosiy matn (ma'ruza)</label>
                                    <textarea 
                                        name="textContent" value={formData.textContent} onChange={handleChange}
                                        className="w-full bg-muted/50 border border-border rounded-[2.5rem] p-8 min-h-[400px] focus:ring-2 focus:ring-primary outline-none transition-all leading-relaxed"
                                        placeholder="Dars matnini shu yerga yozing..."
                                    />
                                </div>
                            </div>
                        </TabWrapper>
                    </TabsContent>

                    <TabsContent value="media">
                        <TabWrapper>
                            <div className="grid gap-10">
                                {/* Video Section */}
                                <div className="bg-muted/30 p-8 rounded-[2.5rem] border border-border space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center"><Video className="w-5 h-5" /></div>
                                        <h3 className="text-xl font-black">Video resurs</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <input 
                                            name="videoUrl" value={formData.videoUrl} onChange={handleChange}
                                            className="flex-1 bg-background border border-border rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="YouTube yoki fayl havolasi"
                                        />
                                        <Button variant="outline" className="rounded-2xl h-auto px-6 border-2 relative">
                                            <Upload className="w-4 h-4 mr-2" /> Yuklash
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'video')} />
                                        </Button>
                                    </div>
                                    {uploadProgress.video > 0 && <Progress value={uploadProgress.video} className="h-1" />}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Video transkripti (AI uchun)</label>
                                            <Button variant="ghost" size="sm" className="text-primary font-bold rounded-lg" onClick={handleTranslate}>
                                                <Sparkles className="w-4 h-4 mr-2" /> AI Tarjima
                                            </Button>
                                        </div>
                                        <textarea 
                                            name="transcript" value={formData.transcript} onChange={handleChange}
                                            className="w-full bg-background border border-border rounded-2xl p-4 min-h-[150px] outline-none"
                                            placeholder="Video matnini shu yerga yozing..."
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Audio Section */}
                                    <div className="bg-muted/30 p-8 rounded-[2.5rem] border border-border space-y-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center"><Music className="w-5 h-5" /></div>
                                            <h3 className="text-lg font-black">Audio / podkast</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <input 
                                                name="audioUrl" value={formData.audioUrl} onChange={handleChange}
                                                className="flex-1 bg-background border border-border rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                                                placeholder="MP3 URL"
                                            />
                                            <Button variant="outline" className="rounded-2xl h-auto border-2 relative">
                                                <Upload className="w-4 h-4" />
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'audio')} />
                                            </Button>
                                        </div>
                                        {uploadProgress.audio > 0 && <Progress value={uploadProgress.audio} className="h-1" />}
                                    </div>

                                    {/* Document Section */}
                                    <div className="bg-muted/30 p-8 rounded-[2.5rem] border border-border space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-lg font-black">Hujjatlar / PDF</h3>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <Button variant="outline" size="sm" className="rounded-xl border-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => setShowUrlModal(true)}>
                                                    <Plus className="w-4 h-4 mr-2" />URL qo'shish
                                                </Button>
                                                <Button variant="outline" size="sm" className="rounded-xl border-2" onClick={() => fileInputRef.current?.click()}>
                                                    <Upload className="w-4 h-4 mr-2" />Fayl yuklash
                                                </Button>
                                                <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" ref={fileInputRef} className="hidden" onChange={handleDocumentFileUpload} />
                                            </div>
                                        </div>
                                        {uploadProgress.document > 0 && <Progress value={uploadProgress.document} className="h-1 mb-2" />}
                                        {/* Document list with limited height */}
                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {documents.length === 0 && (
                                                <div className="flex flex-col items-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
                                                    <FileText className="w-10 h-10 mb-3 opacity-20" />
                                                    <p className="text-sm font-bold">Hujjat qo'shilmagan</p>
                                                    <p className="text-xs opacity-60 mt-1">Yuqoridagi tugmalardan foydalaning</p>
                                                </div>
                                            )}
                                            <AnimatePresence>
                                                {documents.map((doc, idx) => (
                                                    <motion.div key={idx} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center gap-3 p-4 bg-background border border-border rounded-2xl">
                                                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                        <input className="w-28 shrink-0 bg-transparent text-sm font-bold outline-none border-b border-transparent hover:border-border focus:border-primary transition-colors" placeholder="Nomi..." value={doc.name} onChange={(e) => { const u = [...documents]; u[idx].name = e.target.value; setDocuments(u); }} />
                                                        <input className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary" placeholder="URL manzili..." value={doc.url} onChange={(e) => { const u = [...documents]; u[idx].url = e.target.value; setDocuments(u); }} />
                                                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0" onClick={() => setDocuments(documents.filter((_, i) => i !== idx))}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    {/* URL Modal */}
                                    <Dialog open={showUrlModal} onOpenChange={setShowUrlModal}>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Hujjat URL qo'shish</DialogTitle>
                                                <DialogDescription>URL kiriting va "Qo'shish" tugmasini bosing.</DialogDescription>
                                            </DialogHeader>
                                            <input className="w-full bg-background border border-border rounded-xl p-3 mt-2" placeholder="https://example.com/file.pdf" value={manualUrl} onChange={(e) => setManualUrl(e.target.value)} />
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setShowUrlModal(false)}>Bekor</Button>
                                                <Button onClick={() => {
                                                    if (manualUrl) {
                                                        setDocuments(prev => [...prev, { name: manualUrl.split('/').pop().split('.')[0] || 'Hujjat', url: manualUrl }]);
                                                        setManualUrl('');
                                                        setShowUrlModal(false);
                                                    }
                                                }}>Qo'shish</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </TabWrapper>
                    </TabsContent>

                    <TabsContent value="3d">
                        <TabWrapper>
                            <div className="space-y-8">
                                {formData.interactiveUrl ? (
                                    <div className="bg-card border-2 border-primary/20 rounded-[2.5rem] p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><BoxIcon className="w-5 h-5" /></div>
                                                <h3 className="text-xl font-black">Interaktiv 3D model</h3>
                                            </div>
                                            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setFormData({...formData, interactiveUrl: ''})}>
                                                <Trash2 className="w-4 h-4 mr-2" /> O'chirish
                                            </Button>
                                        </div>
                                        <div className="rounded-[2rem] overflow-hidden bg-black h-[400px]">
                                            <ModelViewer model={{ url: formData.interactiveUrl, type: 'sketchfab' }} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="bg-muted/30 p-12 rounded-[3rem] border-2 border-dashed border-border text-center space-y-6">
                                            <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto"><Globe className="w-10 h-10" /></div>
                                            <div className="max-w-md mx-auto space-y-2">
                                                <h3 className="text-2xl font-black">3D Kutubxonadan tanlang</h3>
                                                <p className="text-muted-foreground">Darsingizni interaktiv 3D modellar bilan yanada qiziqarli qiling</p>
                                            </div>
                                            <input 
                                                name="interactiveUrl" value={formData.interactiveUrl} onChange={handleChange}
                                                className="max-w-lg mx-auto w-full bg-background border border-border rounded-2xl p-4 text-center outline-none"
                                                placeholder="Yoki Sketchfab URL manzilini kiriting..."
                                            />
                                        </div>
                                        <Library3D onSelectModel={(m) => setFormData({...formData, interactiveUrl: m.url})} />
                                    </div>
                                )}
                            </div>
                        </TabWrapper>
                    </TabsContent>

                    <TabsContent value="quiz">
                        <TabWrapper>
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black">Dars yakunidagi testlar</h2>
                                    <Button className="rounded-2xl bg-primary px-8 font-bold" onClick={() => setQuiz([...quiz, { question: '', options: ['', '', '', ''], correctAnswer: 0 }])}>
                                        <Plus className="w-4 h-4 mr-2" /> Savol qo'shish
                                    </Button>
                                </div>
                                
                                <div className="space-y-6">
                                    <AnimatePresence>
                                        {quiz.map((q, idx) => (
                                            <motion.div 
                                                key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                                className="bg-muted/30 border border-border p-8 rounded-[2.5rem] relative group"
                                            >
                                                <Button 
                                                    variant="ghost" size="icon" className="absolute top-6 right-6 text-red-500 hover:bg-red-50 rounded-xl"
                                                    onClick={() => setQuiz(quiz.filter((_, i) => i !== idx))}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black">{idx + 1}</div>
                                                    <input 
                                                        className="flex-1 bg-background border border-border rounded-xl p-3 font-bold outline-none focus:ring-2 focus:ring-primary"
                                                        placeholder="Savol matnini kiriting..."
                                                        value={q.question}
                                                        onChange={(e) => {
                                                            const n = [...quiz]; n[idx].question = e.target.value; setQuiz(n);
                                                        }}
                                                    />
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {q.options.map((opt, oIdx) => (
                                                        <div key={`q-${idx}-opt-${oIdx}`} className="flex items-center gap-3 p-3 bg-background rounded-2xl border border-border">
                                                            <input 
                                                                type="radio" name={`q-${idx}`} checked={q.correctAnswer === oIdx}
                                                                onChange={() => { const n = [...quiz]; n[idx].correctAnswer = oIdx; setQuiz(n); }}
                                                                className="w-5 h-5 accent-primary"
                                                            />
                                                            <input 
                                                                className="flex-1 bg-transparent outline-none font-medium"
                                                                placeholder={`${oIdx + 1}-variant`}
                                                                value={opt}
                                                                onChange={(e) => {
                                                                    const n = [...quiz]; n[idx].options[oIdx] = e.target.value; setQuiz(n);
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </TabWrapper>
                    </TabsContent>
                </Tabs>

                <div className="p-6 md:p-8 bg-muted/20 border-t border-border flex justify-end gap-4">
                    <Button variant="ghost" className="rounded-2xl px-10 font-bold" onClick={() => navigate(-1)}>Bekor qilish</Button>
                    <Button 
                        size="lg" className="rounded-[1.5rem] px-12 font-black text-lg bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20"
                        onClick={handleSubmit} disabled={loading}
                    >
                        {loading ? 'Saqlanmoqda...' : <><Save className="w-5 h-5 mr-3" /> {isEdit ? 'Darsni yangilash' : 'Darsni saqlash'}</>}
                    </Button>
                </div>
            </div>
        </div>
    );

    if (courseId) return <div className="bg-background min-h-screen">{formUI}</div>;

    return <NavbarWithDrawer>{formUI}</NavbarWithDrawer>;
};

export default LessonForm;
