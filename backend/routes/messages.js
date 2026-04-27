const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const MutedLesson = require('../models/MutedLesson');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const User = require('../models/User');

// @route   GET /api/messages/:lessonId
// @desc    Get all messages for a specific lesson
// @access  Private
router.get('/:lessonId', auth, async (req, res) => {
    try {
        const messages = await Message.find({ lessonId: req.params.lessonId })
            .populate('sender', 'name role')
            .populate({
                path: 'parentMessage',
                populate: { path: 'sender', select: 'name role' }
            })
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   POST /api/messages
// @desc    Send a new message to a lesson chat
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { lessonId, text, parentMessageId } = req.body;
        const senderId = req.user.id;

        const newMessage = new Message({
            lessonId,
            sender: senderId,
            text,
            parentMessage: parentMessageId || null
        });

        const savedMessage = await newMessage.save();

        // Populate sender info and parent message info
        const populatedMessage = await Message.findById(savedMessage._id)
            .populate('sender', 'name role')
            .populate({
                path: 'parentMessage',
                populate: { path: 'sender', select: 'name role' }
            });

        // --- Notification Logic ---
        // Find the lesson and its parent course to determine recipients
        const lesson = await Lesson.findById(lessonId);
        console.log("NOTIFICATION DEBUG - Lesson found:", !!lesson, "Course reference:", lesson ? lesson.course : null);
        if (lesson && lesson.course) {
            const course = await Course.findById(lesson.course);
            console.log("NOTIFICATION DEBUG - Course found:", !!course);
            if (course) {
                // Potential recipients: all enrolled students + the teacher
                let recipientIds = [...course.students];
                if (course.teacher) {
                    recipientIds.push(course.teacher);
                }

                console.log("NOTIFICATION DEBUG - Potential recipients (incl sender):", recipientIds);

                // Filter out the sender
                recipientIds = recipientIds.filter(id => id.toString() !== senderId.toString());

                console.log("NOTIFICATION DEBUG - Recipients after filtering sender:", recipientIds);

                // Filter out users who muted this lesson
                const mutedRecords = await MutedLesson.find({ lessonId });
                const mutedUserIds = mutedRecords.map(record => record.user.toString());

                const finalRecipients = recipientIds.filter(id => !mutedUserIds.includes(id.toString()));

                console.log("NOTIFICATION DEBUG - Final recipients after mute filter:", finalRecipients);

                // Create notifications in bulk
                if (finalRecipients.length > 0) {
                    const telegramNotify = require('../utils/telegramNotify');
                    
                    const notificationsToInsert = finalRecipients.map(recipientId => ({
                        recipient: recipientId,
                        sender: senderId,
                        lessonId: lessonId,
                        messageText: text.substring(0, 100), // snippet
                        messageId: savedMessage._id
                    }));
                    await Notification.insertMany(notificationsToInsert);

                    // Send Telegram notifications
                    for (const recipientId of finalRecipients) {
                        await telegramNotify(recipientId, `💬 <b>Yangi xabar!</b>\n\n${populatedMessage.sender.name}: ${text}\n\n<i>Dars: ${lesson.title}</i>`);
                    }
                    console.log("NOTIFICATION DEBUG - Notifications inserted and Telegram alerts sent.");
                } else {
                    console.log("NOTIFICATION DEBUG - No final recipients to send notifications to.");
                }
            } else {
                console.log("NOTIFICATION DEBUG - Course not found with ID:", lesson.course);
            }
        } else {
            console.log("NOTIFICATION DEBUG - Lesson not found or missing course reference.");
        }

        res.json(populatedMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   DELETE /api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ msg: 'Xabar topilmadi' });
        }

        // Check if user is authorized to delete
        // Teachers can delete ANY message. Students can only delete THEIR OWN.
        if (req.user.role !== 'teacher' && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
            if (message.sender.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Ruxsat etilmagan' });
            }
        }

        await message.deleteOne();
        res.json({ msg: 'Xabar o\'chirildi' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Xabar topilmadi' });
        }
        res.status(500).send('Server xatosi');
    }
});

module.exports = router;
