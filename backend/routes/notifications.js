const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const MutedLesson = require('../models/MutedLesson');

// @route   GET /api/notifications
// @desc    Get user's unread notifications
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id, isRead: false })
            .populate('sender', 'name role avatar')
            .populate('lessonId', 'title')
            .populate('courseId', 'title')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark a specific notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ msg: 'Bildirishnoma topilmadi' });
        }

        if (notification.recipient.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Ruxsat etilmagan' });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all user's notifications as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ msg: 'Barcha xabarlar o\'qildi' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   GET /api/notifications/mute/:lessonId
// @desc    Check if a lesson is muted by the user
// @access  Private
router.get('/mute/:lessonId', auth, async (req, res) => {
    try {
        const muted = await MutedLesson.findOne({ user: req.user.id, lessonId: req.params.lessonId });
        res.json({ isMuted: !!muted });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   POST /api/notifications/mute
// @desc    Toggle mute status for a lesson chat
// @access  Private
router.post('/mute', auth, async (req, res) => {
    try {
        const { lessonId } = req.body;

        const existingMute = await MutedLesson.findOne({ user: req.user.id, lessonId });

        if (existingMute) {
            // Unmute
            await existingMute.deleteOne();
            return res.json({ isMuted: false, msg: 'Bildirishnomalar yoqildi' });
        } else {
            // Mute
            const newMute = new MutedLesson({ user: req.user.id, lessonId });
            await newMute.save();
            return res.json({ isMuted: true, msg: 'Bildirishnomalar o\'chirildi' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

module.exports = router;
