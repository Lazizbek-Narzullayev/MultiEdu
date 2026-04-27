import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const API_URL = `${API_BASE_URL}/lessons/`;

// Thunks
export const fetchLessons = createAsyncThunk(
    "lessons/fetchAll",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await axios.get(API_URL, {
                headers: { "x-auth-token": auth.user.token }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.msg || err.message);
        }
    }
);

export const addLesson = createAsyncThunk(
    "lessons/add",
    async (lessonData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const response = await axios.post(API_URL, lessonData, {
                headers: { "x-auth-token": auth.user.token }
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.msg || err.message);
        }
    }
);

export const deleteLesson = createAsyncThunk(
    "lessons/delete",
    async (id, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            await axios.delete(API_URL + id, {
                headers: { "x-auth-token": auth.user.token }
            });
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.msg || err.message);
        }
    }
);

const lessonSlice = createSlice({
    name: "lessons",
    initialState: {
        lessons: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchLessons.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLessons.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons = action.payload;
            })
            .addCase(fetchLessons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // add
            .addCase(addLesson.pending, (state) => {
                state.loading = true;
            })
            .addCase(addLesson.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons.unshift(action.payload);
            })
            .addCase(addLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // delete
            .addCase(deleteLesson.fulfilled, (state, action) => {
                state.lessons = state.lessons.filter((l) => l._id !== action.payload);
            });
    },
});

export default lessonSlice.reducer;
