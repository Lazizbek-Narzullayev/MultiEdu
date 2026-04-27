const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Submission = require('../models/Submission');
const LessonProgress = require('../models/LessonProgress');

// @route   GET api/admin/system-stats
// @desc    Get detailed system-wide stats with teacher/course drill-down
// @access  Private (Super Admin)
router.get('/system-stats', auth, roleCheck(['super-admin']), async (req, res) => {
    try {
        // 1. Global Stats
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCourses = await Course.countDocuments();

        // 2. Get all teachers with their stats
        const teachers = await User.find({ role: 'teacher' }).select('name email avatar');

        let systemTotalMastery = 0;
        let systemGradedCourses = 0;

        const teacherStats = await Promise.all(teachers.map(async (teacher) => {
            const courses = await Course.find({ teacher: teacher._id });

            const coursesWithStats = await Promise.all(courses.map(async (course) => {
                const lessonCount = await Lesson.countDocuments({ course: course._id });
                const submissions = await Submission.find({ courseId: course._id, status: 'graded' }).populate('assignmentId', 'maxScore');

                let courseMastery = 0;
                if (submissions.length > 0) {
                    const totalPerc = submissions.reduce((acc, s) => {
                        const max = s.assignmentId?.maxScore || 100;
                        return acc + (s.score / max * 100);
                    }, 0);
                    courseMastery = Math.round(totalPerc / submissions.length);

                    systemTotalMastery += courseMastery;
                    systemGradedCourses++;
                }

                return {
                    _id: course._id,
                    title: course.title,
                    studentCount: course.students.length,
                    lessonCount,
                    mastery: courseMastery
                };
            }));

            const totalTeacherStudents = courses.reduce((acc, c) => acc + c.students.length, 0);
            const gradingCourses = coursesWithStats.filter(c => c.mastery > 0);
            const avgTeacherMastery = gradingCourses.length > 0
                ? Math.round(gradingCourses.reduce((acc, c) => acc + c.mastery, 0) / gradingCourses.length)
                : 0;

            return {
                _id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                avatar: teacher.avatar,
                courseCount: courses.length,
                totalStudents: totalTeacherStudents,
                averageMastery: avgTeacherMastery,
                courses: coursesWithStats
            };
        }));

        const globalAverageMastery = systemGradedCourses > 0 ? Math.round(systemTotalMastery / systemGradedCourses) : 0;

        res.json({
            global: {
                totalTeachers,
                totalStudents,
                totalCourses,
                averageMastery: globalAverageMastery
            },
            teacherStats
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   GET api/admin/recent-activity
// @desc    Get recent platform activities (new users, courses, lessons)
// @access  Private (Super Admin)
router.get('/recent-activity', auth, roleCheck(['super-admin']), async (req, res) => {
    try {
        const limit = 10;

        // So'nggi foydalanuvchilar (talaba va o'qituvchilar)
        const recentUsers = await User.find({ role: { $in: ['student', 'teacher'] } })
            .select('name role date')
            .sort({ date: -1 })
            .limit(limit);

        // So'nggi kurslar
        const recentCourses = await Course.find()
            .select('title createdAt')
            .populate('teacher', 'name')
            .sort({ createdAt: -1 })
            .limit(limit);

        // So'nggi darslar
        const recentLessons = await Lesson.find()
            .select('title date')
            .populate('instructor', 'name')
            .sort({ date: -1 })
            .limit(limit);

        // Hammasi birlashtiriladi va turga qarab belgilanadi
        const activities = [
            ...recentUsers.map(u => ({
                type: u.role === 'teacher' ? 'teacher' : 'student',
                title: u.role === 'teacher' ? "Yangi o'qituvchi qo'shildi" : "Yangi talaba ro'yxatdan o'tdi",
                detail: u.name,
                date: u.date
            })),
            ...recentCourses.map(c => ({
                type: 'course',
                title: "Yangi kurs yaratildi",
                detail: `${c.title}${c.teacher?.name ? ' — ' + c.teacher.name : ''}`,
                date: c.createdAt
            })),
            ...recentLessons.map(l => ({
                type: 'lesson',
                title: "Yangi dars qo'shildi",
                detail: `${l.title}${l.instructor?.name ? ' — ' + l.instructor.name : ''}`,
                date: l.date
            }))
        ];

        // Sanaga qarab tartiblanadi (eng yangi birinchi)
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(activities.slice(0, limit));
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

module.exports = router;
