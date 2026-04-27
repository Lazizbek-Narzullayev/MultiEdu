import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Paper,
    CircularProgress,
    Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { createAssignment, clearAssignmentErrors } from '../../store/Slice/assignmentSlice';

const AssignmentForm = ({ courseId, onComplete }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.assignments);
    const { user } = useSelector(state => state.auth);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [maxScore, setMaxScore] = useState(100);
    const [dueDate, setDueDate] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearAssignmentErrors());

        if (!title.trim() || !description.trim()) {
            return alert("Barcha maydonlarni to'ldiring");
        }

        let attachmentUrl = null;

        if (file) {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'assignments');

            try {
                const uploadRes = await axios.post(`${API_BASE_URL}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-auth-token': user.token
                    }
                });
                attachmentUrl = uploadRes.data.url;
            } catch (err) {
                console.error("Fayl yuklashda xatolik:", err);
                setUploading(false);
                return alert("Fayl yuklashda xatolik yuz berdi");
            }
            setUploading(false);
        }

        const assignmentData = {
            courseId,
            title,
            description,
            maxScore: Number(maxScore),
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            attachmentUrl
        };

        const result = await dispatch(createAssignment(assignmentData));
        if (!result.error) {
            if (onComplete) onComplete();
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, p: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 4 }}>
                <Stack spacing={3}>
                    <Typography variant="h6" fontWeight="900" color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HelpOutlineIcon color="primary" /> Yangi Topshiriq
                    </Typography>

                    <TextField
                        label="Topshiriq Nomi"
                        placeholder="Masalan: 1-Amaliy ish"
                        fullWidth
                        required
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextField
                        label="Topshiriq Tavsifi"
                        placeholder="Talabalar nima qilishi kerakligini batafsil yozing..."
                        fullWidth
                        required
                        multiline
                        rows={4}
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                        <TextField
                            label="Maksimal Baho"
                            type="number"
                            fullWidth
                            required
                            variant="outlined"
                            value={maxScore}
                            onChange={(e) => setMaxScore(e.target.value)}
                            InputProps={{ inputProps: { min: 1, max: 1000 } }}
                        />

                        <TextField
                            label="Muddat (Ixtiyoriy)"
                            type="datetime-local"
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </Stack>

                    <Box>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<AttachFileIcon />}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                            Fayl biriktirish
                            <input
                                type="file"
                                hidden
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </Button>
                        {file && (
                            <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                                Tanlangan fayl: {file.name}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={(loading || uploading) ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={loading || uploading}
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold', px: 6, py: 1.5 }}
                >
                    {(loading || uploading) ? 'Saqlanmoqda...' : 'Topshiriqni Yaratish'}
                </Button>
            </Box>
        </Box>
    );
};

export default AssignmentForm;
