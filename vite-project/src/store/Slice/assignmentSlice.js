import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

export const createAssignment = createAsyncThunk(
    'assignments/create',
    async (assignmentData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.user.token;
            const res = await axios.post(`${API_BASE_URL}/assignments`, assignmentData, {
                headers: { 'x-auth-token': token }
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Topshiriq yaratishda xatolik');
        }
    }
);

export const getCourseAssignments = createAsyncThunk(
    'assignments/getCourseAssignments',
    async (courseId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.user.token;
            const res = await axios.get(`${API_BASE_URL}/assignments/course/${courseId}`, {
                headers: { 'x-auth-token': token }
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Topshiriqlarni yuklashda xatolik');
        }
    }
);

export const deleteAssignment = createAsyncThunk(
    'assignments/delete',
    async (id, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.user.token;
            await axios.delete(`${API_BASE_URL}/assignments/${id}`, {
                headers: { 'x-auth-token': token }
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "O'chirishda xatolik");
        }
    }
);

const assignmentSlice = createSlice({
    name: 'assignments',
    initialState: {
        assignments: [],
        loading: false,
        error: null,
        successMessage: null
    },
    reducers: {
        clearAssignmentErrors: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createAssignment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAssignment.fulfilled, (state, action) => {
                state.loading = false;
                state.assignments.unshift(action.payload);
                state.successMessage = "Topshiriq mavaffaqiyatli yaratildi!";
            })
            .addCase(createAssignment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get
            .addCase(getCourseAssignments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCourseAssignments.fulfilled, (state, action) => {
                state.loading = false;
                state.assignments = action.payload;
            })
            .addCase(getCourseAssignments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteAssignment.fulfilled, (state, action) => {
                state.assignments = state.assignments.filter(a => a._id !== action.payload);
            });
    }
});

export const { clearAssignmentErrors } = assignmentSlice.actions;
export default assignmentSlice.reducer;
