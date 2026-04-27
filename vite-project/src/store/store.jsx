import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/authSlice";
import lessonReducer from "./Slice/lessonSlice";
import coursesReducer from "./Slice/courseSlice";
import quizReducer from "./Slice/quizSlice";
import assignmentReducer from "./Slice/assignmentSlice";
import submissionReducer from "./Slice/submissionSlice";
import announcementReducer from "./Slice/announcementSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lessons: lessonReducer,
    courses: coursesReducer,
    quizzes: quizReducer,
    assignments: assignmentReducer,
    submissions: submissionReducer,
    announcements: announcementReducer
  },
});
