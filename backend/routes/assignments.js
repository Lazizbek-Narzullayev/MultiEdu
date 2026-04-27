const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// 1. Create Assignment (Only specific roles: teacher, admin)
router.post('/', auth, roleCheck(['teacher', 'super-admin', 'admin']), async (req, res) => {
    try {
        const { courseId, title, description, maxScore, dueDate, attachmentUrl } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Kurs topilmadi" });

        const assignment = new Assignment({
            courseId,
            title,
            description,
            maxScore: maxScore || 100,
            dueDate,
            attachmentUrl
        });

        await assignment.save();
        res.status(201).json(assignment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
});

// 2. Get all Assignments for a Course
router.get('/course/:courseId', auth, async (req, res) => {
    try {
        const assignments = await Assignment.find({ courseId: req.params.courseId }).sort({ createdAt: -1 });
        res.json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
});

// 3. Delete Assignment (Teacher/Admin)
router.delete('/:id', auth, roleCheck(['teacher', 'super-admin', 'admin']), async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: "Topshiriq topilmadi" });

        await assignment.deleteOne();
        res.json({ message: "Topshiriq muvaffaqiyatli o'chirildi" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
});

module.exports = router;
