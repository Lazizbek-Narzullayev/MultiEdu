import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Chip,
    Divider
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { submitAssignment, getMySubmission, clearSubmissionErrors } from '../../store/Slice/submissionSlice';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

const SubmissionModal = ({ open, onClose, assignment, courseId }) => {
    const dispatch = useDispatch();
    const { loading, error, mySubmissions } = useSelector(state => state.submissions);
    const { user } = useSelector(state => state.auth);

    const [fileUrl, setFileUrl] = useState('');
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const submission = mySubmissions[assignment?._id];

    useEffect(() => {
        if (open && assignment) {
            dispatch(getMySubmission(assignment._id));
            // Always reset local input state on open/assignment change
            setFile(null);
            setFileUrl('');
            setText('');
            setShowForm(false);
        }
    }, [open, assignment?._id, dispatch]);

    useEffect(() => {
        if (submission) {
            // Only auto-fill if we are NOT in the 'showForm' mode or if we specifically want to edit
            // But to fix the leak, we only populate when the submission is loaded
            setFileUrl(submission.fileUrl || '');
            setText(submission.text || '');
        }
    }, [submission]);

    const handleSubmit = async () => {
        dispatch(clearSubmissionErrors());
        if (!fileUrl.trim() && !text.trim() && !file) {
            return alert("Iltimos, fayl biriktiring, yoki havola/matn kiriting!");
        }

        let uploadedFileUrl = fileUrl;

        if (file) {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'submissions');

            try {
                const uploadRes = await axios.post(`${API_BASE_URL}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': user.token }
                });
                uploadedFileUrl = uploadRes.data.url;
            } catch (err) {
                console.error("Fayl yuklashda xatolik:", err);
                setUploading(false);
                return alert("Fayl yuklashda xato yuz berdi");
            }
            setUploading(false);
        }

        const data = {
            assignmentId: assignment._id,
            courseId,
            fileUrl: uploadedFileUrl,
            text
        };

        const res = await dispatch(submitAssignment(data));
        if (!res.error) {
            setShowForm(false);
            setFile(null);
            onClose();
        }
    };

    if (!assignment) return null;

    const isSubmitted = !!submission;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    {assignment.title}
                    {isSubmitted && (
                        <Chip
                            label={submission.status === 'graded' ? 'Baholangan' : 'Yuborilgan'}
                            color={submission.status === 'graded' ? 'success' : 'primary'}
                            size="small"
                            sx={{ ml: 2, fontWeight: 'bold' }}
                            icon={<CheckCircleIcon />}
                        />
                    )}
                </Box>
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Vazifa sharti:</Typography>
                    <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>{assignment.description}</Typography>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="caption" color="error" fontWeight="bold" sx={{ display: 'block' }}>
                                Maksimal baho: {assignment.maxScore}
                            </Typography>
                            {assignment.dueDate && (
                                <Typography variant="caption" color="text.secondary">
                                    Muddat: {new Date(assignment.dueDate).toLocaleString('uz-UZ')}
                                </Typography>
                            )}
                        </Box>
                        {assignment.attachmentUrl && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<AttachFileIcon />}
                                href={assignment.attachmentUrl}
                                target="_blank"
                                sx={{ borderRadius: 6, textTransform: 'none' }}
                            >
                                Ilova qilingan faylni ko'rish
                            </Button>
                        )}
                    </Box>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {submission?.status === 'graded' && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                        <Typography fontWeight="bold" sx={{ color: '#15803d' }}>Sizga qo'yilgan baho: {submission.score} / {assignment.maxScore}</Typography>
                        {submission.feedback && <Typography variant="body2" sx={{ mt: 1 }}>Izoh: {submission.feedback}</Typography>}
                    </Alert>
                )}

                {isSubmitted && !showForm ? (
                    <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#fff' }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: '#64748b', fontWeight: 'bold' }}>Hozirgi javobingiz:</Typography>
                        
                        {submission.fileUrl && (
                            <Box sx={{ mb: 2, p: 2, bgcolor: '#f0f9ff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #bae6fd' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AttachFileIcon sx={{ color: '#00A5C4' }} />
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#0369a1', wordBreak: 'break-all' }}>
                                        {submission.fileUrl.split('/').pop()}
                                    </Typography>
                                </Box>
                                <Button 
                                    size="small" 
                                    href={submission.fileUrl} 
                                    target="_blank" 
                                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                >
                                    Ko'rish
                                </Button>
                            </Box>
                        )}

                        {submission.text && (
                            <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#1e293b' }}>{submission.text}</Typography>
                            </Box>
                        )}

                        {submission.status !== 'graded' && (
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                onClick={() => setShowForm(true)}
                                sx={{ mt: 1, borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                            >
                                Javobni almashtirish
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Box sx={{ animate: 'fadeIn 0.3s' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">Sizning javobingiz:</Typography>
                            {isSubmitted && (
                                <Button size="small" onClick={() => setShowForm(false)} color="inherit" sx={{ textTransform: 'none', fontSize: '0.75rem' }}>Bekor qilish</Button>
                            )}
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                startIcon={<AttachFileIcon />}
                                sx={{ textTransform: 'none', borderRadius: 2, py: 1.5, borderStyle: 'dashed', borderWidth: 2 }}
                            >
                                {file ? `Tanlangan fayl: ${file.name}` : "Javob faylini biriktirish"}
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </Button>
                        </Box>

                        <TextField
                            label="Fayl havolasi (Google Drive, URL manzil)"
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                            placeholder="http://..."
                        />

                        <TextField
                            label="Yozma javob (agar kerak bo'lsa)"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Box>
                )}

            </DialogContent>

            <DialogActions sx={{ p: 2, px: 3, borderTop: '1px solid #e2e8f0' }}>
                <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>Yopish</Button>
                {(!isSubmitted || showForm) && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading || uploading}
                        startIcon={(loading || uploading) ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
                    >
                        {(loading || uploading) ? "Yuklanmoqda..." : (isSubmitted ? "Javobni yangilash" : "Yuborish")}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default SubmissionModal;
