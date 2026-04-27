import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

const initialState = {
    courses: [],
    officialCourses: [],
    currentCourse: null,
    detailedStats: [],
    studentStats: { completedTopics: 0, completedAssignments: 0, timeSpent: 0, lastLesson: null },
    studentProgress: [],
    loading: false,
    error: null,
};

// Create a new course (Teacher)
export const createCourse = createAsyncThunk('courses/create', async (courseData, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const res = await axios.post(API_BASE_URL + '/courses', courseData, {
            headers: { 'x-auth-token': auth.user.token }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data.msg);
    }
});

// Join a course (Student)
export const joinCourse = createAsyncThunk('courses/join', async (joinCode, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const res = await axios.post(`${API_BASE_URL}/courses/join`, { joinCode }, {
            headers: { 'x-auth-token': auth.user.token }
        });
        return res.data.course;
    } catch (err) {
        return rejectWithValue(err.response.data.msg);
    }
});

// Get official courses
export const getOfficialCourses = createAsyncThunk('courses/getOfficial', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const res = await axios.get(`${API_BASE_URL}/courses/official`, {
            headers: { 'x-auth-token': auth.user.token }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data.msg);
    }
});

// Get my courses (Teacher/Student)
export const getMyCourses = createAsyncThunk('courses/getMyCourses', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const res = await axios.get(`${API_BASE_URL}/courses/my-courses`, {
            headers: { 'x-auth-token': auth.user.token }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data.msg);
    }
});

// Get course by ID
export const getCourseById = createAsyncThunk('courses/getById', async (id, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const res = await axios.get(`${API_BASE_URL}/courses/${id}`, {
            headers: { 'x-auth-token': auth.user.token }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data.msg);
    }
});

// Get detailed stats for teacher
export const getTeacherDetailedStats = createAsyncThunk('courses/getDetailedStats', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const res = await axios.get(`${API_BASE_URL}/courses/teacher/detailed-stats`, {
            headers: { 'x-auth-token': auth.user.token }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data.msg);
    }
});

// Get student dashboard stats
export const getStudentStats = createAsyncThunk('courses/getStudentStats', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const res = await axios.get(`${API_BASE_URL}/courses/student/dashboard-stats`, {
            headers: { 'x-auth-token': auth.user.token }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.msg || 'Xatolik');
    }
});

// Get student overall progress
export const getStudentProgress = createAsyncThunk('courses/getStudentProgress', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const res = await axios.get(`${API_BASE_URL}/students/progress`, {
            headers: { 'x-auth-token': auth.user.token }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.msg || 'Xatolik');
    }
});

// Update course details (Teacher)
export const updateCourse = createAsyncThunk('courses/update', async ({ id, courseData }, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const res = await axios.put(`${API_BASE_URL}/courses/${id}`, courseData, {
            headers: { 'x-auth-token': auth.user.token }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data.msg);
    }
});

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; },
        clearCurrentCourse: (state) => { state.currentCourse = null; }
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createCourse.pending, (state) => { state.loading = true; })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courses.unshift(action.payload);
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Join
            .addCase(joinCourse.fulfilled, (state, action) => {
                state.courses.unshift(action.payload);
            })
            .addCase(joinCourse.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Get My Courses
            .addCase(getMyCourses.pending, (state) => { state.loading = true; })
            .addCase(getMyCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(getMyCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get By ID
            .addCase(getCourseById.fulfilled, (state, action) => {
                state.currentCourse = action.payload;
            })
            .addCase(getCourseById.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Update
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.currentCourse = action.payload;
                const index = state.courses.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.courses[index] = action.payload;
                }
            })
            // Detailed Stats
            .addCase(getTeacherDetailedStats.fulfilled, (state, action) => {
                state.detailedStats = action.payload;
            })
            // Official Courses
            .addCase(getOfficialCourses.pending, (state) => { state.loading = true; })
            .addCase(getOfficialCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.officialCourses = action.payload;
            })
            .addCase(getOfficialCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Student Stats
            .addCase(getStudentStats.fulfilled, (state, action) => {
                state.studentStats = action.payload;
            })
            // Student Progress
            .addCase(getStudentProgress.fulfilled, (state, action) => {
                state.studentProgress = action.payload;
            });
    },
});

export const { clearError, clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
