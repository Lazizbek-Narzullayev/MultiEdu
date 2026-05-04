const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const OfficialLesson = require('../models/OfficialLesson');
const OfficialCourse = require('../models/OfficialCourse');

// @route   GET api/official-lessons/:id
// @desc    Get official lesson by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const lesson = await OfficialLesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ msg: 'Dars topilmadi' });
        res.json(lesson);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi' });
    }
});

// @route   POST api/official-lessons
// @desc    Create an official lesson
// @access  Private (Super Admin)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'super-admin') return res.status(403).json({ msg: 'Ruxsat yo\'q' });
    try {
        const newLesson = new OfficialLesson({ ...req.body });
        const lesson = await newLesson.save();
        // Update course lessons array
        await OfficialCourse.findByIdAndUpdate(req.body.course, { $push: { lessons: lesson._id } });
        res.json(lesson);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi' });
    }
});

module.exports = router;
