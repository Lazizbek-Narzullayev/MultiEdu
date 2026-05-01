import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/Components/ui/button';
import { updateCourse, createCourse } from '../../store/Slice/courseSlice';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { Save, X, Trash2, Image as ImageIcon } from 'lucide-react';

const CourseForm = ({ courseId, initialData, onComplete, isEdit = true }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.courses);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: '',
        isOfficial: false,
        sequence: 0
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                thumbnail: initialData.thumbnail || '',
                isOfficial: initialData.isOfficial || false,
                sequence: initialData.sequence || 0
            });
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            Swal.fire('Xato', 'Sarlavha va tavsif majburiy', 'error');
            return;
        }

        try {
            if (isEdit) {
                await dispatch(updateCourse({ id: courseId, courseData: formData })).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Yangilandi',
                    text: 'Kurs muvaffaqiyatli yangilandi',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                await dispatch(createCourse(formData)).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Yaratildi',
                    text: 'Yangi kurs yaratildi',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
            onComplete();
        } catch (error) {
            Swal.fire('Xato', error || 'Xatolik yuz berdi', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-black uppercase text-[#94a3b8] ml-1 tracking-widest">Kurs Sarlavhasi</label>
                    <input 
                        className="w-full h-14 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white px-4 outline-none transition-all font-bold text-slate-700 mt-1" 
                        placeholder="Masalan: Full-Stack Web Development" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                        required
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase text-[#94a3b8] ml-1 tracking-widest">Kurs Tavsifi</label>
                    <textarea 
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-4 min-h-[150px] focus:outline-none transition-all text-sm font-bold text-slate-700 mt-1" 
                        placeholder="Kurs haqida batafsil ma'lumot..." 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        required
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase text-[#94a3b8] ml-1 tracking-widest">Thumbnail (Rasm URL)</label>
                    <div className="flex gap-3 mt-1">
                        <div className="relative flex-1">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
                            <input 
                                className="w-full h-14 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white pl-12 pr-4 outline-none transition-all font-bold text-slate-700" 
                                placeholder="https://example.com/image.jpg" 
                                value={formData.thumbnail} 
                                onChange={e => setFormData({...formData, thumbnail: e.target.value})} 
                            />
                        </div>
                        {formData.thumbnail && (
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-100 shrink-0">
                                <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                {initialData?.isOfficial && (
                    <div>
                        <label className="text-[10px] font-black uppercase text-[#94a3b8] ml-1 tracking-widest">Tartib raqami (Sequence)</label>
                        <input 
                            type="number"
                            className="w-full h-14 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white px-4 outline-none transition-all font-bold text-slate-700 mt-1" 
                            value={formData.sequence} 
                            onChange={e => setFormData({...formData, sequence: parseInt(e.target.value)})} 
                        />
                    </div>
                )}
            </div>

            <div className="flex gap-3 pt-4">
                <Button 
                    type="button" 
                    variant="ghost" 
                    className="flex-1 h-12 rounded-xl font-black text-[#64748b]" 
                    onClick={onComplete}
                >
                    Bekor qilish
                </Button>
                <Button 
                    type="submit" 
                    className="flex-1 h-12 rounded-xl font-black bg-primary text-white shadow-xl shadow-primary/20 border-none"
                    disabled={loading}
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isEdit ? 'Yangilash' : 'Yaratish'}
                </Button>
            </div>
        </form>
    );
};

export default CourseForm;
