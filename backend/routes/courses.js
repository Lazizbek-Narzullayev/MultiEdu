const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const crypto = require('crypto');

// @route   POST api/courses
// @desc    Create a new private course
// @access  Private (Teacher / Super Admin)
router.post('/', auth, async (req, res) => {
    const { title, description, thumbnail, isOfficial, sequence } = req.body;

    if (req.user.role !== 'teacher' && req.user.role !== 'super-admin') {
        return res.status(403).json({ msg: 'Sizda kurs yaratish huquqi yo\'q' });
    }

    try {
        // Generate a random 6-character unique join code
        const joinCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        const newCourse = new Course({
            title,
            description,
            thumbnail,
            teacher: req.user.id,
            joinCode,
            isOfficial: isOfficial || false,
            sequence: sequence || 0
        });

        const course = await newCourse.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   GET api/courses/my-courses
// @desc    Get courses created by the teacher OR joined by the student
// @access  Private
router.get('/my-courses', auth, async (req, res) => {
    try {
        let courses;
        if (req.user.role === 'teacher') {
            courses = await Course.find({ teacher: req.user.id }).sort({ createdAt: -1 });
        } else {
            courses = await Course.find({ students: req.user.id }).sort({ createdAt: -1 });
        }

        // Fetch lessons for each course to ensure counts are accurate on the dashboard
        const coursesWithLessons = await Promise.all(courses.map(async (course) => {
            const lessons = await Lesson.find({ course: course._id });
            return { ...course._doc, lessons };
        }));

        res.json(coursesWithLessons);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   GET api/courses/official
// @desc    Get all official sequential courses
// @access  Private
router.get('/official', auth, async (req, res) => {
    try {
        const courses = await Course.find({ isOfficial: true }).sort({ sequence: 1 });
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   POST api/courses/join
// @desc    Join a course via joinCode
// @access  Private (Student)
router.post('/join', auth, async (req, res) => {
    const { joinCode } = req.body;

    try {
        const course = await Course.findOne({ joinCode });
        if (!course) {
            return res.status(404).json({ msg: 'Bunday kodli kurs topilmadi' });
        }

        // Check if student is already in the course
        if (course.students.includes(req.user.id)) {
            return res.status(400).json({ msg: 'Siz allaqachon ushbu kursga a\'zo bo\'lgansiz' });
        }

        course.students.push(req.user.id);
        await course.save();

        res.json({ msg: 'Kursga muvaffaqiyatli qo\'shildingiz', course });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   GET api/courses/student/dashboard-stats
// @desc    Get real-time stats for student dashboard (Admin content only)
// @access  Private (Student)
router.get('/student/dashboard-stats', auth, async (req, res) => {
    try {
        const LessonProgress = require('../models/LessonProgress');
        const Submission = require('../models/Submission');
        const User = require('../models/User');

        // 1. Find all Admin courses
        // We'll populate the teacher to check their role
        const allCourses = await Course.find().populate('teacher', 'role');
        const adminCourseIds = allCourses
            .filter(c => c.teacher && (c.teacher.role === 'admin' || c.teacher.role === 'super-admin'))
            .map(c => c._id);

        // 2. Count completed topics in these Admin courses
        const completedTopics = await LessonProgress.countDocuments({
            student: req.user.id,
            course: { $in: adminCourseIds }
        });

        // 3. Count completed assignments in these Admin courses
        const completedAssignments = await Submission.countDocuments({
            studentId: req.user.id,
            courseId: { $in: adminCourseIds }
        });

        // 4. Get User's timeSpent and lastLesson
        const user = await User.findById(req.user.id).populate('lastLesson', 'title');

        res.json({
            completedTopics,
            completedAssignments,
            timeSpent: user.timeSpent || 0,
            lastLesson: user.lastLesson
        });
    } catch (err) {
        console.error('Dashboard stats error:', err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   GET api/courses/:id
// @desc    Get course details with lessons and topics
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('teacher', 'name email')
            .populate('students', 'name email')
            .populate({
                path: 'topics.lessons',
                model: 'Lesson'
            });

        if (!course) {
            return res.status(404).json({ msg: 'Kurs topilmadi' });
        }

        const isJoined = course.students.some(s => s._id.toString() === req.user.id);
        const isOwner = course.teacher._id.toString() === req.user.id;
        const isSuperAdmin = req.user.role === 'super-admin';
        const isOfficial = course.isOfficial;

        if (!isJoined && !isOwner && !isSuperAdmin && !isOfficial) {
            return res.status(403).json({ msg: 'Sizda ushbu kursni ko\'rish huquqi yo\'q' });
        }

        // Fetch lessons for this course (if not using topics or for flat list)
        const lessons = await Lesson.find({ course: req.params.id }).sort({ sequence: 1, date: 1 });

        // Get progress for current student
        const LessonProgress = require('../models/LessonProgress');
        const progress = await LessonProgress.find({ student: req.user.id, course: req.params.id });
        const completedLessonIds = progress.map(p => p.lesson.toString());

        const lessonsWithStatus = lessons.map(lesson => ({
            ...lesson._doc,
            isCompleted: completedLessonIds.includes(lesson._id.toString())
        }));

        // If official, also map topics with completion status
        let topicsWithStatus = null;
        if (course.topics && course.topics.length > 0) {
            topicsWithStatus = course.topics.map(topic => ({
                ...topic._doc,
                lessons: topic.lessons.map(lesson => ({
                    ...lesson._doc,
                    isCompleted: completedLessonIds.includes(lesson._id.toString())
                }))
            }));
        }

        res.json({ ...course._doc, lessons: lessonsWithStatus, topics: topicsWithStatus });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   PUT api/courses/:id
// @desc    Update course details
// @access  Private (Teacher who owns the course)
router.put('/:id', auth, async (req, res) => {
    const { title, description, thumbnail, topics, isOfficial, sequence } = req.body;

    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ msg: 'Kurs topilmadi' });
        }

        // Only the teacher who created it can update it
        if (course.teacher.toString() !== req.user.id && req.user.role !== 'super-admin') {
            return res.status(403).json({ msg: 'Sizda ushbu kursni tahrirlash huquqi yo\'q' });
        }

        course = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: { title, description, thumbnail, topics, isOfficial, sequence } },
            { new: true }
        );

        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   GET api/courses/admin/all-courses
// @desc    Get all courses in the system
// @access  Private (Super Admin)
router.get('/admin/all-courses', auth, async (req, res) => {
    try {
        if (req.user.role !== 'super-admin') {
            return res.status(403).json({ msg: 'Faqat Super Admin barcha kurslarni ko\'ra oladi' });
        }
        const courses = await Course.find()
            .populate('teacher', 'name email')
            .populate('students', 'name email')
            .sort({ createdAt: -1 });
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   GET api/courses/teacher/detailed-stats
// @desc    Get detailed stats for teacher's courses including lesson views
// @access  Private (Teacher / Super Admin)
router.get('/teacher/detailed-stats', auth, async (req, res) => {
    try {
        if (req.user.role !== 'teacher' && req.user.role !== 'super-admin') {
            return res.status(403).json({ msg: 'Ruxsat yo\'q' });
        }

        const courses = await Course.find({ teacher: req.user.id }).sort({ createdAt: -1 });
        const LessonProgress = require('../models/LessonProgress');
        const Submission = require('../models/Submission');

        const detailedStats = await Promise.all(courses.map(async (course) => {
            // 1. Get lessons for this course
            const lessons = await Lesson.find({ course: course._id }).sort({ date: 1 });

            // 2. Get view counts for each lesson
            const lessonsWithStats = await Promise.all(lessons.map(async (lesson) => {
                const viewCount = await LessonProgress.countDocuments({ lesson: lesson._id });
                return {
                    _id: lesson._id,
                    title: lesson.title,
                    viewCount
                };
            }));

            // 3. Get average mastery for this course
            const submissions = await Submission.find({ courseId: course._id, status: 'graded' }).populate('assignmentId', 'maxScore');
            let courseMastery = 0;
            if (submissions.length > 0) {
                const totalPerc = submissions.reduce((acc, s) => {
                    const max = s.assignmentId?.maxScore || 100;
                    return acc + (s.score / max * 100);
                }, 0);
                courseMastery = Math.round(totalPerc / submissions.length);
            }

            return {
                _id: course._id,
                title: course.title,
                studentCount: course.students.length,
                lessons: lessonsWithStats,
                averageMastery: courseMastery,
                totalLessons: lessons.length
            };
        }));

        res.json(detailedStats);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});


// @route   GET api/courses/teacher/recent-activity
// @desc    Get recent activities in teacher's courses
// @access  Private (Teacher)
router.get('/teacher/recent-activity', auth, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ msg: 'Ruxsat yo\'q' });
        }

        const courses = await Course.find({ teacher: req.user.id }).select('_id title');
        const courseIds = courses.map(c => c._id);

        const Submission = require('../models/Submission');
        const LessonProgress = require('../models/LessonProgress');
        
        const limit = 10;
        
        // So'nggi topshiriqlar
        const recentSubmissions = await Submission.find({ courseId: { $in: courseIds } })
            .populate('studentId', 'name')
            .sort({ submittedAt: -1 })
            .limit(limit);

        // So'nggi ko'rilgan darslar
        const recentProgress = await LessonProgress.find({ course: { $in: courseIds } })
            .populate('student', 'name')
            .populate('lesson', 'title')
            .sort({ lastUpdated: -1 })
            .limit(limit);

        const activities = [
            ...recentSubmissions.map(s => ({
                id: `sub_${s._id}`,
                type: 'submission',
                title: "Yangi topshiriq topshirildi",
                detail: `${s.studentId?.name || 'Talaba'} vazifa yubordi`,
                date: s.submittedAt
            })),
            ...recentProgress.map(p => ({
                id: `prog_${p._id}`,
                type: 'lesson',
                title: "Dars materialini o'rgandi",
                detail: `${p.student?.name || 'Talaba'} "${p.lesson?.title || 'Mavzu'}" bilan tanishdi`,
                date: p.lastUpdated
            }))
        ];

        activities.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(activities.slice(0, limit));
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

module.exports = router;
