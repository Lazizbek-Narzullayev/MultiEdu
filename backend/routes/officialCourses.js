const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const OfficialCourse = require('../models/OfficialCourse');
const OfficialLesson = require('../models/OfficialLesson');

// @route   GET api/official-courses
// @desc    Get all official curriculum courses
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const courses = await OfficialCourse.find().sort({ sequence: 1 });
        // Fetch lessons for each course
        const coursesWithLessons = await Promise.all(courses.map(async (course) => {
            const lessons = await OfficialLesson.find({ course: course._id }).sort({ sequence: 1 });
            return { ...course._doc, lessons };
        }));
        res.json(coursesWithLessons);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi' });
    }
});

// @route   POST api/official-courses
// @desc    Create an official course (Super Admin only)
// @access  Private (Super Admin)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'super-admin') {
        return res.status(403).json({ msg: 'Ruxsat yo\'q' });
    }
    const { title, description, thumbnail, sequence } = req.body;
    try {
        const newCourse = new OfficialCourse({ title, description, thumbnail, sequence });
        const course = await newCourse.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi' });
    }
});

// @route   GET api/official-courses/:id
// @desc    Get official course detail
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const course = await OfficialCourse.findById(req.params.id);
        if (!course) return res.status(404).json({ msg: 'Topilmadi' });
        const lessons = await OfficialLesson.find({ course: req.params.id }).sort({ sequence: 1 });
        res.json({ ...course._doc, lessons });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi' });
    }
});

module.exports = router;
