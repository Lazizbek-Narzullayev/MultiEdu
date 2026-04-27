import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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

import { addLesson } from '../../store/Slice/lessonSlice';
import { API_BASE_URL } from '../../config/apiConfig';
import Library3D from './Library3D';
import ModelViewer from './ModelViewer';
import NavbarWithDrawer from '../NavDrawer';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';

const LessonForm = ({ courseId = null, onComplete = null }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.lessons);
    const { user } = useSelector((state) => state.auth);

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
    const [uploadProgress, setUploadProgress] = useState({
        video: 0,
        audio: 0,
        document: 0,
        thumbnail: 0
    });

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

        const action = await dispatch(addLesson({ ...formData, quiz }));
        if (addLesson.fulfilled.match(action)) {
            Swal.fire({ icon: 'success', title: 'Dars yaratildi', timer: 1500, showConfirmButton: false });
            if (onComplete) onComplete(action.payload);
            else navigate(courseId ? `/courses/${courseId}` : '/lessons');
        }
    };

    const TabWrapper = ({ children }) => (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-8 pt-6"
        >
            {children}
        </motion.div>
    );

    const formUI = (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <div className="bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="p-8 md:p-12 border-b border-border bg-muted/20">
                    <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Yangi Dars Yarating</h1>
                    <p className="text-muted-foreground font-medium">Interaktiv, multimodal va AI bilan boyitilgan ta'lim tajribasi</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="p-8 md:p-12">
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
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Dars Sarlavhasi</label>
                                    <input 
                                        name="title" value={formData.title} onChange={handleChange}
                                        className="w-full bg-muted/50 border border-border rounded-2xl p-4 text-xl font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="Masalan: Fotosintez jarayoni haqida asosiy tushunchalar"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Qisqacha Tavsif</label>
                                    <textarea 
                                        name="description" value={formData.description} onChange={handleChange}
                                        className="w-full bg-muted/50 border border-border rounded-2xl p-4 min-h-[100px] focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="Darsning qisqacha mazmunini yozing..."
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Muqova Rasmi</label>
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
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Asosiy Matn (Ma'ruza)</label>
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
                                        <h3 className="text-xl font-black">Video Resurs</h3>
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
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Video Transkripti (AI uchun)</label>
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
                                            <h3 className="text-lg font-black">Audio / Podkast</h3>
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
                                    <div className="bg-muted/30 p-8 rounded-[2.5rem] border border-border space-y-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                                            <h3 className="text-lg font-black">Hujjat / PDF</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <input 
                                                name="documentUrl" value={formData.documentUrl} onChange={handleChange}
                                                className="flex-1 bg-background border border-border rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                                                placeholder="PDF URL"
                                            />
                                            <Button variant="outline" className="rounded-2xl h-auto border-2 relative">
                                                <Upload className="w-4 h-4" />
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'document')} />
                                            </Button>
                                        </div>
                                        {uploadProgress.document > 0 && <Progress value={uploadProgress.document} className="h-1" />}
                                    </div>
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
                                                <h3 className="text-xl font-black">Interaktiv 3D Model</h3>
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
                                        <Plus className="w-4 h-4 mr-2" /> Savol Qo'shish
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
                                                        <div key={oIdx} className="flex items-center gap-3 p-3 bg-background rounded-2xl border border-border">
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

                <div className="p-8 md:p-12 bg-muted/20 border-t border-border flex justify-end gap-4">
                    <Button variant="ghost" className="rounded-2xl px-10 font-bold" onClick={() => navigate(-1)}>Bekor qilish</Button>
                    <Button 
                        size="lg" className="rounded-[1.5rem] px-12 font-black text-lg bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20"
                        onClick={handleSubmit} disabled={loading}
                    >
                        {loading ? 'Saqlanmoqda...' : <><Save className="w-5 h-5 mr-3" /> Darsni Saqlash</>}
                    </Button>
                </div>
            </div>
        </div>
    );

    if (courseId) return <div className="bg-background min-h-screen">{formUI}</div>;

    return <NavbarWithDrawer>{formUI}</NavbarWithDrawer>;
};

export default LessonForm;
