const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const LessonProgress = require('../models/LessonProgress');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// @route   GET api/students/progress
// @desc    Get progress details for all joined courses
// @access  Private (Student)
router.get('/progress', auth, async (req, res) => {
    try {
        // 1. Find all courses student is enrolled in
        const courses = await Course.find({ students: req.user.id })
            .populate('teacher', 'name email');

        const progressSummary = [];

        for (const course of courses) {
            // 2. Get total lessons for this course
            const totalLessons = await Lesson.countDocuments({ course: course._id });

            // 3. Get viewed lessons for this student in this course
            const viewedLessonsCount = await LessonProgress.countDocuments({
                student: req.user.id,
                course: course._id
            });

            // 4. Get total quizzes for this course
            const totalQuizzes = await Quiz.countDocuments({ course: course._id });

            // 5. Get completed quizzes for this student in this course
            const quizAttempts = await QuizAttempt.find({
                student: req.user.id,
                course: course._id
            }).populate('quiz', 'title');

            // 6. Get Assignments count and submissions
            const totalAssignments = await Assignment.countDocuments({ courseId: course._id });
            const submissions = await Submission.find({
                studentId: req.user.id,
                courseId: course._id
            }).populate('assignmentId', 'title maxScore');

            // 7. Calculate Average Grade
            // Quiz scores
            const quizPercentages = quizAttempts.map(a => (a.score / a.totalQuestions) * 100);
            
            // Graded Assignment scores
            const assignmentPercentages = submissions
                .filter(s => s.status === 'graded')
                .map(s => (s.score / (s.assignmentId?.maxScore || 100)) * 100);

            const allScores = [...quizPercentages, ...assignmentPercentages];
            const averageGrade = allScores.length > 0 
                ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
                : 0;

            // 8. Calculate Overall Mastery Percentage
            // Items: Lessons viewed (completion only), Quizzes (one per quiz), Assignments (one per assignment)
            const totalItems = totalLessons + totalQuizzes + totalAssignments;
            const completedItems = viewedLessonsCount + quizAttempts.length + submissions.length;
            const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

            progressSummary.push({
                courseId: course._id,
                courseTitle: course.title,
                teacherName: course.teacher.name,
                totalLessons,
                viewedLessonsCount,
                totalQuizzes,
                completedQuizzesCount: quizAttempts.length,
                totalAssignments,
                completedAssignmentsCount: submissions.length,
                averageGrade,
                quizAttempts: quizAttempts.map(a => ({
                    quizId: a.quiz?._id,
                    quizTitle: a.quiz?.title,
                    score: a.score,
                    totalQuestions: a.totalQuestions
                })),
                submissions: submissions.map(s => ({
                    assignmentId: s.assignmentId?._id,
                    title: s.assignmentId?.title,
                    score: s.score,
                    maxScore: s.assignmentId?.maxScore || 100,
                    status: s.status
                })),
                overallPercentage: percentage
            });
        }

        res.json(progressSummary);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

module.exports = router;
