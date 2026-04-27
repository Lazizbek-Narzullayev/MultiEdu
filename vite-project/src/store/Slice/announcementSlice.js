import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

export const createAnnouncement = createAsyncThunk(
    'announcements/create',
    async (announcementData, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth.user;
            const res = await axios.post(`${API_BASE_URL}/announcements`, announcementData, {
                headers: { 'x-auth-token': token }
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data.message || "E'lon yuborishda xatolik");
        }
    }
);

export const getCourseAnnouncements = createAsyncThunk(
    'announcements/getCourseAnnouncements',
    async (courseId, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth.user;
            const res = await axios.get(`${API_BASE_URL}/announcements/course/${courseId}`, {
                headers: { 'x-auth-token': token }
            });
            return { courseId, announcements: res.data };
        } catch (err) {
            return rejectWithValue(err.response.data.message || "E'lonlarni yuklashda xatolik");
        }
    }
);

const announcementSlice = createSlice({
    name: 'announcements',
    initialState: {
        announcements: {},
        loading: false,
        error: null
    },
    reducers: {
        clearAnnouncementErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAnnouncement.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAnnouncement.fulfilled, (state, action) => {
                state.loading = false;
                const { courseId } = action.payload;
                if (!state.announcements[courseId]) state.announcements[courseId] = [];
                state.announcements[courseId].unshift(action.payload);
            })
            .addCase(createAnnouncement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCourseAnnouncements.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCourseAnnouncements.fulfilled, (state, action) => {
                state.loading = false;
                state.announcements[action.payload.courseId] = action.payload.announcements;
            })
            .addCase(getCourseAnnouncements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearAnnouncementErrors } = announcementSlice.actions;
export default announcementSlice.reducer;
