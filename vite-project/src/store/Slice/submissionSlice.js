import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

export const submitAssignment = createAsyncThunk(
    'submissions/submit',
    async (submissionData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.user.token;
            const res = await axios.post(`${API_BASE_URL}/submissions`, submissionData, {
                headers: { 'x-auth-token': token }
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Javob yuborishda xatolik');
        }
    }
);

export const getAssignmentSubmissions = createAsyncThunk(
    'submissions/getAssignmentSubmissions',
    async (assignmentId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.user.token;
            const res = await axios.get(`${API_BASE_URL}/submissions/assignment/${assignmentId}`, {
                headers: { 'x-auth-token': token }
            });
            return res.data; // List of submissions for teacher
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Yuklashda xatolik');
        }
    }
);

export const gradeSubmission = createAsyncThunk(
    'submissions/grade',
    async ({ submissionId, score, feedback }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.user.token;
            const res = await axios.put(`${API_BASE_URL}/submissions/${submissionId}/grade`, { score, feedback }, {
                headers: { 'x-auth-token': token }
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Baholashda xatolik');
        }
    }
);

export const getCourseGrades = createAsyncThunk(
    'submissions/getCourseGrades',
    async (courseId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.user.token;
            const res = await axios.get(`${API_BASE_URL}/submissions/course/${courseId}/grades`, {
                headers: { 'x-auth-token': token }
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Baholarni yuklashda xatolik');
        }
    }
);

export const getTeacherStats = createAsyncThunk(
    'submissions/getTeacherStats',
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.user.token;
            const res = await axios.get(`${API_BASE_URL}/submissions/teacher/stats`, {
                headers: { 'x-auth-token': token }
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Statistikani yuklashda xatolik');
        }
    }
);

export const getMySubmission = createAsyncThunk(
    'submissions/getMySubmission',
    async (assignmentId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.user.token;
            const res = await axios.get(`${API_BASE_URL}/submissions/my/${assignmentId}`, {
                headers: { 'x-auth-token': token }
            });
            return { assignmentId, data: res.data };
        } catch (error) {
            if (error.response?.status === 404) return { assignmentId, data: null };
            return rejectWithValue(error.response?.data?.message || "Xatolik");
        }
    }
);

const submissionSlice = createSlice({
    name: 'submissions',
    initialState: {
        submissions: [], // For teacher viewing all submissions of an assignment
        mySubmissions: {}, // key: assignmentId, value: submission (For student)
        allCourseGrades: [], // For the grades table
        teacherStats: { averageMastery: 0, totalGraded: 0 },
        loading: false,
        error: null,
        successMessage: null
    },
    reducers: {
        clearSubmissionErrors: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Submit
            .addCase(submitAssignment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitAssignment.fulfilled, (state, action) => {
                state.loading = false;
                state.mySubmissions[action.payload.assignmentId] = action.payload;
                state.successMessage = "Javobingiz saqlandi";
            })
            .addCase(submitAssignment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Assignment submissions
            .addCase(getAssignmentSubmissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAssignmentSubmissions.fulfilled, (state, action) => {
                state.loading = false;
                state.submissions = action.payload;
            })
            .addCase(getAssignmentSubmissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Grade processing
            .addCase(gradeSubmission.fulfilled, (state, action) => {
                const index = state.submissions.findIndex(s => s._id === action.payload._id);
                if (index !== -1) {
                    state.submissions[index] = action.payload;
                }
                state.successMessage = 'Baho saqlandi';
            })
            // Get course grades
            .addCase(getCourseGrades.fulfilled, (state, action) => {
                state.allCourseGrades = action.payload;
            })
            // Get my submission
            .addCase(getMySubmission.fulfilled, (state, action) => {
                state.mySubmissions[action.payload.assignmentId] = action.payload.data;
            })
            // Get teacher stats
            .addCase(getTeacherStats.fulfilled, (state, action) => {
                state.teacherStats = action.payload;
            });
    }
});

export const { clearSubmissionErrors } = submissionSlice.actions;
export default submissionSlice.reducer;
