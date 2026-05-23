import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    MenuItem,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

const ModelUploadModal = ({ open, onClose, onUploadSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        category: 'arkitektura',
        type: 'glb',
        description: '',
        thumbnail: ''
    });
    const [file, setFile] = useState(null);
    const [thumbFile, setThumbFile] = useState(null);

    const categories = [
        { value: 'arkitektura', label: 'Kompyuter Arxitekturasi' },
        { value: 'tarmoq', label: 'Tarmoqlar va Serverlar' },
        { value: 'ai', label: 'Sun\'iy Intellekt' },
        { value: 'xavfsizlik', label: 'Kiberxavfsizlik' },
        { value: 'biologiya', label: 'Biologiya' },
        { value: 'astronomiya', label: 'Astronomiya' },
        { value: 'texnika', label: 'Texnika va Sanoat' },
        { value: 'vr', label: 'VR/360°' }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleThumbChange = (e) => {
        if (e.target.files[0]) {
            setThumbFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    const handleRemoveThumb = () => {
        setThumbFile(null);
    };

    const handleSubmit = async () => {
        if (!formData.title || !file || !thumbFile) {
            setError('Iltimos barcha majburiy maydonlarni to\'ldiring');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            };

            // 1. Upload GLB file
            const glbFormData = new FormData();
            glbFormData.append('file', file);
            glbFormData.append('type', '3d-models');
            const glbRes = await axios.post(`${API_BASE_URL}/upload`, glbFormData, config);

            // 2. Upload Thumbnail
            const thumbFormData = new FormData();
            thumbFormData.append('file', thumbFile);
            thumbFormData.append('type', '3d-thumbnails');
            const thumbRes = await axios.post(`${API_BASE_URL}/upload`, thumbFormData, config);

            // 3. Create Model Record
            const modelData = {
                ...formData,
                url: glbRes.data.url,
                thumbnail: thumbRes.data.url
            };

            await axios.post(`${API_BASE_URL}/models3d`, modelData, {
                headers: { 'x-auth-token': token }
            });

            onUploadSuccess();
            onClose();
            // Reset form
            setFormData({ title: '', category: 'arkitektura', type: 'glb', description: '', thumbnail: '' });
            setFile(null);
            setThumbFile(null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Yangi 3D Model Yuklash</Typography>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    <TextField
                        name="title"
                        label="Model Nomi"
                        fullWidth
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        name="category"
                        label="Kategoriya"
                        select
                        fullWidth
                        value={formData.category}
                        onChange={handleChange}
                    >
                        {categories.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        name="description"
                        label="Tavsif"
                        fullWidth
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <Box sx={{ border: '2px dashed #e2e8f0', p: 3, borderRadius: 2, textAlign: 'center' }}>
                        <input
                            accept=".glb,.gltf,.dls"
                            style={{ display: 'none' }}
                            id="glb-file"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="glb-file">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                sx={{ mb: 1 }}
                            >
                                GLB/GLTF/DLS fayl tanlash
                            </Button>
                        </label>
                        {file && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Typography variant="caption" sx={{ flexGrow: 1, fontSize: '0.75rem' }}>
                                    {`Tanlandi: ${file.name}`}
                                </Typography>
                                <IconButton size="small" onClick={handleRemoveFile} aria-label="Remove file">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                        !file && (
                        <Typography variant="caption" display="block">
                            {'Maksimal hajm: 50MB'}
                        </Typography>
                        )
                    </Box>

                    <Box sx={{ border: '2px dashed #e2e8f0', p: 3, borderRadius: 2, textAlign: 'center' }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="thumb-file"
                            type="file"
                            onChange={handleThumbChange}
                        />
                        <label htmlFor="thumb-file">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                sx={{ mb: 1, color: 'secondary.main', borderColor: 'secondary.main' }}
                            >
                                Muqova (Thumbnail) tanlash
                            </Button>
                        </label>
                        <Typography variant="caption" display="block">
                            {thumbFile ? `Tanlandi: ${thumbFile.name}` : 'Rasm fayli (JPG, PNG)'}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={onClose} color="inherit">Bekor qilish</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{
                        bgcolor: '#00A5C4',
                        '&:hover': { bgcolor: '#008ba6' },
                        minWidth: 120
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Yuklash'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModelUploadModal;
