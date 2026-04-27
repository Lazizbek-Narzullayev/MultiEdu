import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

// Get token from local storage
const getToken = () => localStorage.getItem('token');

// API Base URL
const API_URL = `${API_BASE_URL}/quizzes`;

// Async Thunks

export const createQuiz = createAsyncThunk(
    'quizzes/create',
    async (quizData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await axios.post(API_URL, quizData, {
                headers: { 'x-auth-token': auth.user.token }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.msg || error.message;
            return rejectWithValue(message);
        }
    }
);

export const getCourseQuizzes = createAsyncThunk(
    'quizzes/getCourseQuizzes',
    async (courseId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await axios.get(`${API_URL}/course/${courseId}`, {
                headers: { 'x-auth-token': auth.user.token }
            });
            return response.data; // { quizzes, attempts }
        } catch (error) {
            const message = error.response?.data?.msg || error.message;
            return rejectWithValue(message);
        }
    }
);

export const getQuizDetail = createAsyncThunk(
    'quizzes/getDetail',
    async (id, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: { 'x-auth-token': auth.user.token }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.msg || error.message;
            return rejectWithValue(message);
        }
    }
);

export const submitQuiz = createAsyncThunk(
    'quizzes/submit',
    async ({ id, answers }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await axios.post(`${API_URL}/${id}/submit`, { answers }, {
                headers: { 'x-auth-token': auth.user.token }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.msg || error.message;
            return rejectWithValue(message);
        }
    }
);

export const getQuizResults = createAsyncThunk(
    'quizzes/getResults',
    async (id, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await axios.get(`${API_URL}/${id}/results`, {
                headers: { 'x-auth-token': auth.user.token }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.msg || error.message;
            return rejectWithValue(message);
        }
    }
);

export const getCourseAllAttempts = createAsyncThunk(
    'quizzes/getCourseAllAttempts',
    async (courseId, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await axios.get(`${API_URL}/course/${courseId}/all-results`, {
                headers: { 'x-auth-token': auth.user.token }
            });
            return response.data; // Array of all attempts in the course
        } catch (error) {
            const message = error.response?.data?.msg || error.message;
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    quizzes: [],
    attempts: {}, // user's personal attempts map { quizId: attempt }
    allCourseAttempts: [], // for teachers: all attempts in the course
    currentQuiz: null,
    currentResults: null,
    loading: false,
    error: null,
    successMessage: null
};

const quizSlice = createSlice({
    name: 'quizzes',
    initialState,
    reducers: {
        clearQuizErrors: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        clearCurrentQuiz: (state) => {
            state.currentQuiz = null;
            state.currentResults = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Quiz
            .addCase(createQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.quizzes.push(action.payload);
                state.successMessage = 'Test muvaffaqiyatli yaratildi!';
            })
            .addCase(createQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Course Quizzes
            .addCase(getCourseQuizzes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCourseQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.quizzes = action.payload.quizzes;
                state.attempts = action.payload.attempts || {};
            })
            .addCase(getCourseQuizzes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Quiz Detail
            .addCase(getQuizDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuizDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentQuiz = action.payload;
            })
            .addCase(getQuizDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Submit Quiz
            .addCase(submitQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = `Test yakunlandi. Natija: ${action.payload.score}/${action.payload.totalQuestions}`;
            })
            .addCase(submitQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Results
            .addCase(getQuizResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuizResults.fulfilled, (state, action) => {
                state.loading = false;
                state.currentResults = action.payload;
            })
            .addCase(getQuizResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get All Course Attempts (Teacher)
            .addCase(getCourseAllAttempts.fulfilled, (state, action) => {
                state.allCourseAttempts = action.payload;
            });
    }
});

export const { clearQuizErrors, clearCurrentQuiz } = quizSlice.actions;
export default quizSlice.reducer;
