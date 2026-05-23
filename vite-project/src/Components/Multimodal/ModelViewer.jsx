import React, { Suspense, useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Box, CircularProgress, Typography, Button, IconButton, Tooltip } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DownloadIcon from '@mui/icons-material/Download';

// Official React 3D Engine
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls, Html } from '@react-three/drei';

// Custom Error Boundary specifically for catching useGLTF fetch errors (404s, CORS, etc.)
class ModelErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error("3D Model Fetch/Parse Error:", error);
        if (this.props.onError) this.props.onError();
    }
    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}

// 3D Model Component
const GlbModel = ({ url }) => {
    // This will fetch the model, parse it, and cache it.
    // Throws errors to the closest ErrorBoundary if it fails.
    const normalizedUrl = url.replace(/\\\\/g, '/');
    const { scene } = useGLTF(normalizedUrl, true);
};

// Simplified Loading Spinner integrated inside the 3D Canvas (Fixes the setState render collision with EnvironmentCube)
function StaticLoader() {
    return (
        <Html center>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 250, p: 2, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 2, backdropFilter: 'blur(5px)' }}>
                <CircularProgress size={30} sx={{ color: '#00A5C4', mb: 2 }} />
                <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 700 }}>
                    3D Obyekt Render Qilinmoqda...
                </Typography>
            </Box>
        </Html>
    );
}

const ModelViewer = ({ model }) => {
    const [hasError, setHasError] = useState(false);
    const [key, setKey] = useState(0);
    const containerRef = useRef(null);

    const url = typeof model === 'string' ? model : model?.url;
    
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                // Foydalanuvchi to'liq ekrandan chiqqanda (ESC yoki tugma orqali) 
                // R3F element qotib qolmasligi uchun uni tozalab boshqatan (bir zumda) chizib yuboramiz.
                setKey(prev => prev + 1);
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    if (!url) return null;

    // Reset error state when URL changes
    React.useEffect(() => {
        setHasError(false);
    }, [url]);

    let type = model.type;
    if (!type) {
        if (url.endsWith('.glb') || url.endsWith('.gltf') || url.includes('/raw/')) {
            type = 'glb';
        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            type = 'vr';
        } else {
            type = 'iframe';
        }
    }

    const isVideo = type === 'vr' || type === 'iframe';

    const handleRetry = () => {
        setHasError(false);
        setKey(prev => prev + 1);
    };

    const handleFullscreen = () => {
        if (containerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                containerRef.current.requestFullscreen();
            }
        }
    };

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = url.split('/').pop() || 'model.glb';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Error State (e.g. Broken Link)
    if (hasError) {
        return (
            <Box sx={{ width: '100%', height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: '#f8fafc', color: '#64748b', p: 4, textAlign: 'center', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <ErrorOutlineIcon sx={{ fontSize: 48, mb: 2, color: '#f43f5e' }} />
                <Typography variant="h6" sx={{ color: '#0f172a', mb: 1, fontWeight: 700 }}>3D Modelni ochib bo'lmadi</Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>Fayl manzili noto'g'ri (404) yoki internet aloqasida muammo bor.</Typography>
                <Button 
                    variant="contained" 
                    onClick={handleRetry} 
                    startIcon={<RefreshIcon />}
                    sx={{ bgcolor: '#00A5C4', '&:hover': { bgcolor: '#008ba5' }, textTransform: 'none', borderRadius: 2 }}
                >
                    Qayta urinish
                </Button>
            </Box>
        );
    }
    // Video Embed
    if (isVideo) {
        const getYouTubeId = (url) => {
            if (!url) return null;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        };
        const videoId = getYouTubeId(url);

        return (
            <Box sx={{ width: '100%', height: '100%', minHeight: '400px', bgcolor: '#000', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                {videoId ? (
                    <YouTube
                        videoId={videoId}
                        opts={{
                            height: '100%',
                            width: '100%',
                            playerVars: { 
                                rel: 0, 
                                modestbranding: 1,
                                controls: 1, 
                                disablekb: 1,
                                fs: 1,
                                iv_load_policy: 3,
                            },
                        }}
                        className="w-full h-full absolute top-0 left-0"
                    />
                ) : (
                    <iframe 
                        title="Video Content"
                        src={url}
                        style={{ width: '108%', height: '108%', border: 'none', position: 'absolute', top: '-4%', left: '-4%', pointerEvents: 'none' }}
                        allowFullScreen
                    />
                )}
            </Box>
        );
    }

    // Professional R3F Rendering Engine
    return (
        <Box ref={containerRef} sx={{ width: '100%', height: '100%', minHeight: '400px', position: 'relative', bgcolor: '#f8fafc', borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }} key={`viewer-${key}`}>
            <ModelErrorBoundary onError={() => setHasError(true)}>
                <Canvas 
                    shadows 
                    camera={{ position: [0, 0, 5], fov: 35 }} 
                    gl={{ preserveDrawingBuffer: true, antialias: true, toneMappingExposure: 1.45 }}
                >
                    <Suspense fallback={<StaticLoader />}>
                        {/* Stage will automatically light, position, and center the model in frame regardless of its size */}
                        <Stage environment="city" intensity={1.6} adjustCamera={2}>
                            <GlbModel url={url} />
                        </Stage>
                        <OrbitControls autoRotate makeDefault minDistance={0.5} maxDistance={50} />
                    </Suspense>
                </Canvas>
            </ModelErrorBoundary>
            
            {/* Control Panel (Fullscreen & Download) */}
            <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1, zIndex: 10 }}>
                <Tooltip title="Yuklab olish">
                    <IconButton onClick={handleDownload} sx={{ bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }, color: '#0f172a' }}>
                        <DownloadIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="To'liq ekran">
                    <IconButton onClick={handleFullscreen} sx={{ bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }, color: '#0f172a' }}>
                        <FullscreenIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Interaction Instructions Overlay */}
            <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', bgcolor: 'rgba(255,255,255,0.9)', py: 0.8, px: 2, borderRadius: 10, display: 'flex', gap: 2, pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>🖱️ Aylantirish</Typography>
                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>⚙️ Yaqinlashtirish</Typography>
            </Box>
        </Box>
    );
};

// Preload models for faster user experience in the library
useGLTF.preload('https://modelviewer.dev/shared-assets/models/Astronaut.glb');

export default ModelViewer;
