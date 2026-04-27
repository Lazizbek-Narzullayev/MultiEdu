const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// 1. Create Announcement (Teacher/Admin only)
router.post('/', auth, roleCheck(['teacher', 'super-admin', 'admin']), async (req, res) => {
    try {
        const { courseId, content } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Kurs topilmadi" });

        const announcement = new Announcement({
            courseId,
            teacherId: req.user.id,
            content
        });

        await announcement.save();

        // Send notifications to all students in the course
        const students = course.students || [];
        const telegramNotify = require('../utils/telegramNotify');
        
        const notificationPromises = students.map(async studentId => {
            const notification = new Notification({
                recipient: studentId,
                sender: req.user.id,
                courseId: courseId,
                messageText: `Yangi e'lon: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`
            });
            
            // Telegram bildirishnomasi
            await telegramNotify(studentId, `📢 <b>Yangi e'lon!</b>\n\n${content}\n\n<i>Kurs: ${course.title}</i>`);
            
            return notification.save();
        });

        await Promise.all(notificationPromises);

        res.status(201).json(announcement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
});

// 2. Get all Announcements for a Course
router.get('/course/:courseId', auth, async (req, res) => {
    try {
        const announcements = await Announcement.find({ courseId: req.params.courseId })
            .populate('teacherId', 'name avatar')
            .sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
});

module.exports = router;
