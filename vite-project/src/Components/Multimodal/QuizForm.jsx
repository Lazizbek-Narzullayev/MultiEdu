import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Stack,
    Paper,
    Divider,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    CircularProgress,
    Alert,
    Slide,
    Fade,
    Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useDispatch, useSelector } from 'react-redux';
import { createQuiz, clearQuizErrors } from '../../store/Slice/quizSlice';

const QuizForm = ({ courseId, onComplete }) => {
    const dispatch = useDispatch();
    const { loading, error, successMessage } = useSelector(state => state.quizzes);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', ''], correctOptionIndex: 0 }
    ]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', ''], correctOptionIndex: 0 }]);
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[optIndex] = value;
        setQuestions(newQuestions);
    };

    const handleAddOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push('');
        setQuestions(newQuestions);
    };

    const handleRemoveOption = (qIndex, optIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options.length > 2) {
            newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== optIndex);
            if (newQuestions[qIndex].correctOptionIndex >= newQuestions[qIndex].options.length) {
                newQuestions[qIndex].correctOptionIndex = 0;
            }
        }
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearQuizErrors());

        if (!title.trim()) return alert('Test nomini kiriting');
        if (questions.length === 0) return alert('Kamida bitta savol qo\'shing');

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText.trim()) return alert(`${i + 1}-savol matnini kiriting`);
            for (let j = 0; j < q.options.length; j++) {
                if (!q.options[j].trim()) return alert(`${i + 1}-savolning ${j + 1}-variantini kiriting`);
            }
        }

        const quizData = { title, description, courseId, questions };

        const result = await dispatch(createQuiz(quizData));
        if (!result.error) {
            if (onComplete) onComplete();
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, p: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>{successMessage}</Alert>}

            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 4 }}>
                <Stack spacing={3}>
                    <Typography variant="h6" fontWeight="900" color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HelpOutlineIcon color="primary" /> Umumiy Ma'lumot
                    </Typography>
                    <TextField
                        label="Test Nomi"
                        placeholder="Masalan: JavaScript Asoslari"
                        fullWidth
                        required
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}
                    />
                    <TextField
                        label="Test Tavsifi"
                        placeholder="Ushbu test bilan o'z bilimingizni sinab ko'ring..."
                        fullWidth
                        multiline
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}
                    />
                </Stack>
            </Paper>

            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="800" color="#1e293b">Savollar Ro'yxati</Typography>
                <Chip label={`${questions.length} Savol`} color="primary" variant="filled" sx={{ fontWeight: 'bold' }} />
            </Box>

            <Stack spacing={4}>
                {questions.map((q, qIndex) => (
                    <Slide direction="up" in={true} mountOnEnter unmountOnExit key={qIndex}>
                        <Paper elevation={0} sx={{
                            p: 4,
                            border: '1px solid #e2e8f0',
                            borderRadius: 5,
                            bgcolor: '#ffffff',
                            position: 'relative',
                            transition: '0.3s',
                            '&:hover': { boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', borderColor: '#3b82f6' }
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        bgcolor: '#3b82f6', color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: '900', fontSize: '1.1rem'
                                    }}>
                                        {qIndex + 1}
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold">Savol Matni</Typography>
                                </Box>
                                <IconButton color="error" onClick={() => handleRemoveQuestion(qIndex)} disabled={questions.length === 1} sx={{ bgcolor: '#fef2f2' }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>

                            <TextField
                                placeholder="Savolni shu yerga yozing..."
                                fullWidth
                                required
                                multiline
                                rows={2}
                                sx={{ mb: 4, bgcolor: '#f8fafc', borderRadius: 2 }}
                                value={q.questionText}
                                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                            />

                            <Typography variant="subtitle2" sx={{ mb: 2, color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                                Variantlar (To'g'risini belgilang):
                            </Typography>

                            <FormControl component="fieldset" fullWidth>
                                <RadioGroup
                                    value={q.correctOptionIndex}
                                    onChange={(e) => handleQuestionChange(qIndex, 'correctOptionIndex', parseInt(e.target.value))}
                                >
                                    <Stack spacing={2}>
                                        {q.options.map((opt, optIndex) => (
                                            <Paper
                                                key={optIndex}
                                                elevation={0}
                                                sx={{
                                                    display: 'flex', alignItems: 'center', gap: 2, p: 1,
                                                    border: '1px solid',
                                                    borderColor: q.correctOptionIndex === optIndex ? '#10b981' : '#f1f5f9',
                                                    bgcolor: q.correctOptionIndex === optIndex ? '#f0fdf4' : '#f8fafc',
                                                    borderRadius: 3,
                                                    transition: '0.2s'
                                                }}
                                            >
                                                <FormControlLabel
                                                    value={optIndex}
                                                    control={<Radio color="success" />}
                                                    label=""
                                                    sx={{ mr: 0, ml: 1 }}
                                                />
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    placeholder={`Variant ${optIndex + 1}`}
                                                    variant="standard"
                                                    InputProps={{ disableUnderline: true }}
                                                    sx={{ '& .MuiInputBase-input': { fontWeight: q.correctOptionIndex === optIndex ? 'bold' : 'normal' } }}
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                                />
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleRemoveOption(qIndex, optIndex)}
                                                    disabled={q.options.length <= 2}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Paper>
                                        ))}
                                    </Stack>
                                </RadioGroup>
                            </FormControl>

                            <Button
                                startIcon={<AddCircleIcon />}
                                size="small"
                                sx={{ mt: 3, fontWeight: 'bold', textTransform: 'none' }}
                                onClick={() => handleAddOption(qIndex)}
                            >
                                Variant Qo'shish
                            </Button>
                        </Paper>
                    </Slide>
                ))}
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, mb: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<AddCircleIcon />}
                    onClick={handleAddQuestion}
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold', px: 4, py: 1.5 }}
                >
                    Yangi Savol Qo'shish
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={loading}
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold', px: 6, py: 1.5, fontSize: '1rem', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)' }}
                >
                    {loading ? 'Saqlanmoqda...' : 'Testni Yakunlash'}
                </Button>
            </Box>
        </Box>
    );
};

export default QuizForm;
