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
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Collapse,
    IconButton,
    Chip,
    Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useDispatch, useSelector } from 'react-redux';
import { getAssignmentSubmissions, gradeSubmission, clearSubmissionErrors } from '../../store/Slice/submissionSlice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const GradingModal = ({ open, onClose, assignment }) => {
    const dispatch = useDispatch();
    const { submissions, loading } = useSelector(state => state.submissions);

    const [expandedIds, setExpandedIds] = useState({});
    const [scores, setScores] = useState({});
    const [feedbacks, setFeedbacks] = useState({});

    useEffect(() => {
        if (open && assignment) {
            dispatch(getAssignmentSubmissions(assignment._id));
        }
    }, [open, assignment, dispatch]);

    const toggleExpand = (subId) => {
        setExpandedIds(prev => ({ ...prev, [subId]: !prev[subId] }));
    };

    const handleScoreChange = (subId, val) => {
        setScores(prev => ({ ...prev, [subId]: val }));
    };

    const handleFeedbackChange = (subId, val) => {
        setFeedbacks(prev => ({ ...prev, [subId]: val }));
    };

    const handleSaveGrade = async (submissionId) => {
        const score = scores[submissionId];
        const feedback = feedbacks[submissionId] || '';

        if (!score || score < 0 || score > assignment?.maxScore) {
            return alert(`Baho 0 dan ${assignment?.maxScore} gacha bo'lishi kerak!`);
        }

        const data = { submissionId, score: Number(score), feedback };
        await dispatch(gradeSubmission(data));
        alert("Baho saqlandi!");
    };

    if (!assignment) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 4, height: '80vh' } }}>
            <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', pb: 2 }}>
                {assignment.title} - Javoblar
                <Typography variant="body2" color="text.secondary" mt={1}>
                    Barcha yuborilgan maksimal baho: {assignment.maxScore}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ mt: 2, p: 0 }}>
                {loading && submissions.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : submissions.length === 0 ? (
                    <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
                        Hali hech qanday javob yuborilmagan.
                    </Typography>
                ) : (
                    <List disablePadding>
                        {submissions.map((sub) => {
                            const isExpanded = expandedIds[sub._id];
                            const currentScore = scores[sub._id] !== undefined ? scores[sub._id] : (sub.score || '');
                            const currentFeedback = feedbacks[sub._id] !== undefined ? feedbacks[sub._id] : (sub.feedback || '');

                            return (
                                <React.Fragment key={sub._id}>
                                    <ListItem
                                        sx={{
                                            bgcolor: sub.status === 'graded' ? '#f0fdf4' : 'white',
                                            '&:hover': { bgcolor: '#f8fafc' },
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => toggleExpand(sub._id)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: sub.status === 'graded' ? '#10b981' : '#3b82f6' }}>
                                                {sub.studentId?.name?.charAt(0) || 'T'}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={sub.studentId?.name || "Noma'lum talaba"}
                                            secondary={`Yuborildi: ${new Date(sub.submittedAt).toLocaleString('uz-UZ')}`}
                                            primaryTypographyProps={{ fontWeight: 700 }}
                                        />

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            {sub.status === 'graded' && (
                                                <Chip label={`${sub.score}/${assignment.maxScore}`} size="small" color="success" sx={{ fontWeight: 'bold' }} />
                                            )}
                                            {sub.status === 'pending' && (
                                                <Chip label="Kutmoqda" size="small" color="warning" sx={{ fontWeight: 'bold' }} />
                                            )}
                                            <IconButton onClick={(e) => { e.stopPropagation(); toggleExpand(sub._id); }}>
                                                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                        </Box>
                                    </ListItem>

                                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                        <Box sx={{ p: 3, pl: 9, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>

                                            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" mb={1}>
                                                Talaba yuborgan URL/Havola:
                                            </Typography>
                                            {sub.fileUrl ? (
                                                <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all', color: '#2563eb', display: 'block', marginBottom: '16px' }}>
                                                    {sub.fileUrl}
                                                </a>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" mb={2}>Havola yuborilmagan.</Typography>
                                            )}

                                            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" mb={1}>
                                                Talaba kiritgan matn:
                                            </Typography>
                                            {sub.text ? (
                                                <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{sub.text}</Typography>
                                                </Paper>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" mb={3}>Matn yuborilmagan.</Typography>
                                            )}

                                            <Divider sx={{ mb: 3 }} />

                                            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" mb={2}>
                                                Baholash
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                <TextField
                                                    label="Baho"
                                                    type="number"
                                                    size="small"
                                                    sx={{ 
                                                        width: 100,
                                                        '& .MuiOutlinedInput-root': { borderRadius: 3 }
                                                    }}
                                                    value={currentScore}
                                                    onChange={(e) => handleScoreChange(sub._id, e.target.value)}
                                                />
                                                <TextField
                                                    label="Izoh yozish (Feedback)"
                                                    fullWidth
                                                    size="small"
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                                    value={currentFeedback}
                                                    onChange={(e) => handleFeedbackChange(sub._id, e.target.value)}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleSaveGrade(sub._id)}
                                                    sx={{ 
                                                        textTransform: 'none', 
                                                        fontWeight: 'black',
                                                        borderRadius: 3,
                                                        px: 4,
                                                        height: 40,
                                                        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
                                                    }}
                                                >
                                                    Saqlash
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Collapse>
                                    <Divider />
                                </React.Fragment>
                            )
                        })}
                    </List>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                <Button onClick={onClose} color="inherit">Yopish</Button>
            </DialogActions>
        </Dialog>
    );
};

export default GradingModal;
