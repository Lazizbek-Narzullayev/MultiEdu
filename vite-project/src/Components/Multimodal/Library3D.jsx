import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Chip,
    Tabs,
    Tab
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ModelViewer from './ModelViewer';
import ModelUploadModal from './ModelUploadModal';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect } from 'react';
import { API_BASE_URL } from '../../config/apiConfig';

// Verified 100% Stable and Fast-Loading 3D Models Library
const PUBLIC_MODELS = [
    {
        id: 'astronaut-space',
        title: 'Astronavt Koinotda',
        category: 'texnika',
        type: 'glb',
        url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
        thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
        description: 'Eng mashhur koinot astronavtining to\'liq interaktiv 3D modeli.'
    },
    {
        id: 'blockchain-core',
        title: 'Blockchain va Kripto-Xavfsizlik',
        category: 'xavfsizlik',
        type: 'glb',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
        description: 'Kriptografik xavfsizlik va blockchain bloklari himoyasi (Shlem).'
    },
    {
        id: 'tech-innovation',
        title: 'Raqamli Innovatsiyalar (Flight Helmet)',
        category: 'texnika',
        type: 'glb',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/FlightHelmet/glTF-Binary/FlightHelmet.glb',
        thumbnail: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=600&q=80',
        description: 'Aviatsiya va raqamli innovatsiyalar shlemining 3D vizualizatsiyasi.'
    },
    {
        id: 'iot-smart-lantern',
        title: 'IoT va Aqlli Yoritish Qurilmasi',
        category: 'ai',
        type: 'glb',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Lantern/glTF-Binary/Lantern.glb',
        thumbnail: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
        description: 'Internet buyumlari orqali masofaviy boshqariladigan aqlli chiroq qurilmasi.'
    },
    {
        id: 'cyber-organic',
        title: 'Kiber-Organik Tizimlar (Brain Stem)',
        category: 'ai',
        type: 'glb',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb',
        thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80',
        description: 'Inson miya nerv tizimlari va biologik kiber-organika modeli.'
    },
    {
        id: 'premium-duck',
        title: 'Innovatsion 3D Sariq O\'rdak',
        category: 'texnika',
        type: 'glb',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb',
        thumbnail: 'https://images.unsplash.com/photo-1559811814-e2c57b5e69df?auto=format&fit=crop&w=600&q=80',
        description: 'Eng mashhur va o\'ta yengil 3D o\'yinchoq o\'rdak modeli.'
    },
    {
        id: 'iss-360-tech',
        title: 'ISS Fazo Stansiyasi (VR Tajriba)',
        category: 'vr',
        type: 'vr',
        url: 'https://www.youtube.com/embed/2Ozlokw5f2M',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
        description: 'Xalqaro fazo stansiyasining 360 darajali texnologik sayohati.'
    }
];

const Library3D = ({ onSelectModel }) => {
    const { user } = useSelector((state) => state.auth);
    const [openViewer, setOpenViewer] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);
    const [currentTab, setCurrentTab] = useState('barchasi');
    const [dynamicModels, setDynamicModels] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAuthorized = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'super-admin';

    const fetchModels = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/models3d`);
            setDynamicModels(res.data);
        } catch (err) {
            console.error('3D modellarni yuklashda xatolik:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModels();
    }, []);

    const allModels = [...PUBLIC_MODELS, ...dynamicModels];

    const handlePreview = (model) => {
        setSelectedModel(model);
        setOpenViewer(true);
    };

    const handleConfirmSelection = () => {
        if (selectedModel && onSelectModel) {
            onSelectModel(selectedModel);
            setOpenViewer(false);
        }
    };

    const filteredModels = currentTab === 'barchasi'
        ? allModels
        : allModels.filter(m => m.category === currentTab || (currentTab === 'vr' && m.type === 'vr'));

    return (
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    <ThreeDRotationIcon sx={{ verticalAlign: 'middle', mr: 1, color: '#00A5C4' }} />
                    3D va VR Ta'limiy Kutubxona
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isAuthorized && (
                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => setOpenUpload(true)}
                            sx={{
                                bgcolor: '#00A5C4',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#008ba6' }
                            }}
                        >
                            Yangi Model Qoshish
                        </Button>
                    )}
                    <Chip label="Beta" size="small" sx={{ bgcolor: '#00A5C4', color: 'white', fontWeight: 'bold' }} />
                </Box>
            </Box>

            <Tabs
                value={currentTab}
                onChange={(e, v) => setCurrentTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    mb: 4,
                    '& .MuiTabs-indicator': { backgroundColor: '#00A5C4' },
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, color: '#64748b' },
                    '& .Mui-selected': { color: '#00A5C4 !important' }
                }}
            >
                <Tab label="Barchasi" value="barchasi" />
                <Tab label="Kompyuter Arxitekturasi" value="arkitektura" />
                <Tab label="Tarmoqlar va Serverlar" value="tarmoq" />
                <Tab label="Sun'iy Intellekt" value="ai" />
                <Tab label="Kiberxavfsizlik" value="xavfsizlik" />
                <Tab label="Biologiya" value="biologiya" />
                <Tab label="Astronomiya" value="astronomiya" />
                <Tab label="Texnika va Sanoat" value="texnika" />
                <Tab label="VR/360° Tajribalar" value="vr" />
            </Tabs>

            <Grid container spacing={3}>
                {filteredModels.map((model) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={model.id}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 4,
                                border: '1px solid #e2e8f0',
                                transition: '0.2s',
                                '&:hover': { transform: 'translateY(-4px)', borderColor: '#00A5C4', boxShadow: '0 10px 15px -3px rgba(0, 165, 196, 0.1)' }
                            }}
                        >
                            <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: '#e2e8f0' }}>
                                <img
                                    src={model.thumbnail}
                                    alt={model.title}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                                    {model.type === 'vr' ? (
                                        <Chip icon={<ViewInArIcon sx={{ color: 'white !important', fontSize: 16 }} />} label="VR/360" size="small" sx={{ backdropFilter: 'blur(4px)', bgcolor: 'rgba(0,0,0,0.6)', color: 'white', fontWeight: 'bold' }} />
                                    ) : model.type === 'spline' ? (
                                        <Chip label="Spline 3D" size="small" sx={{ backdropFilter: 'blur(4px)', bgcolor: 'rgba(236, 72, 153, 0.8)', color: 'white', fontWeight: 'bold' }} />
                                    ) : (
                                        <Chip label="Sketchfab" size="small" sx={{ backdropFilter: 'blur(4px)', bgcolor: 'rgba(56, 189, 248, 0.8)', color: 'white', fontWeight: 'bold' }} />
                                    )}
                                </Box>
                            </Box>
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: '#1e293b', lineHeight: 1.2 }}>
                                    {model.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    {model.description}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2, pt: 0 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => handlePreview(model)}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        color: '#00A5C4',
                                        borderColor: '#00A5C4',
                                        '&:hover': { bgcolor: '#f0f9ff' }
                                    }}
                                >
                                    Ko'rib chiqish (Preview)
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
                {filteredModels.length === 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ py: 8, textAlign: 'center' }}>
                            <Typography color="text.secondary">Ushbu kategoriyada hozircha modellar yo'q.</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            {/* Viewer Dialog */}
            <Dialog
                open={openViewer}
                onClose={() => setOpenViewer(false)}
                fullWidth
                maxWidth="lg"
                PaperProps={{ sx: { borderRadius: 4, height: '80vh', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a' } }}
            >
                <DialogTitle sx={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ fontWeight: 800 }}>{selectedModel?.title}</Typography>
                        <Chip label={selectedModel?.type?.toUpperCase()} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                    </Box>
                    <IconButton onClick={() => setOpenViewer(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, flexGrow: 1, position: 'relative', bgcolor: 'black' }}>
                    {selectedModel && <ModelViewer model={selectedModel} />}
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Button onClick={() => setOpenViewer(false)} sx={{ color: '#94a3b8' }}>Bekor qilish</Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmSelection}
                        sx={{ bgcolor: '#00A5C4', fontWeight: 'bold', textTransform: 'none', borderRadius: 2, px: 4 }}
                    >
                        Ushbu modelni darsga qo'shish
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Upload Modal */}
            <ModelUploadModal
                open={openUpload}
                onClose={() => setOpenUpload(false)}
                onUploadSuccess={fetchModels}
            />
        </Box>
    );
};

export default Library3D;
