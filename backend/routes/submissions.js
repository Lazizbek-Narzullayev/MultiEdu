const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// 1. Submit Assignment (Student)
router.post('/', auth, roleCheck(['student', 'teacher', 'admin', 'super-admin']), async (req, res) => {
    try {
        const { assignmentId, courseId, fileUrl, text } = req.body;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ message: "Topshiriq topilmadi" });

        // Check if student already submitted
        let submission = await Submission.findOne({ assignmentId, studentId: req.user.id });

        if (submission) {
            // Update submission
            submission.fileUrl = fileUrl || submission.fileUrl;
            submission.text = text || submission.text;
            submission.submittedAt = Date.now();
            await submission.save();
            return res.json(submission);
        }

        submission = new Submission({
            assignmentId,
            courseId,
            studentId: req.user.id,
            fileUrl,
            text
        });

        await submission.save();
        res.status(201).json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
});

// 2. Get all submissions for an Assignment (Teacher/Admin)
router.get('/assignment/:assignmentId', auth, roleCheck(['teacher', 'super-admin', 'admin']), async (req, res) => {
    try {
        const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
            .populate('studentId', 'name email avatar')
            .sort({ submittedAt: -1 });
        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
});

// 3. Get student's submission for an assignment
router.get('/my/:assignmentId', auth, async (req, res) => {
    try {
        const submission = await Submission.findOne({ assignmentId: req.params.assignmentId, studentId: req.user.id });
        if (!submission) return res.status(404).json({ message: "Siz hali javob yubormagansiz" });
        res.json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
});

// 4. Grade Submission (Teacher/Admin)
router.put('/:id/grade', auth, roleCheck(['teacher', 'super-admin', 'admin']), async (req, res) => {
    try {
        const { score, feedback } = req.body;
        const submission = await Submission.findById(req.params.id);

        if (!submission) return res.status(404).json({ message: "Javob topilmadi" });

        submission.score = score;
        submission.feedback = feedback;
        submission.status = 'graded';
        submission.gradedAt = Date.now();

        await submission.save();

        // Bildirishnoma yuborish
        const Notification = require('../models/Notification');
        const telegramNotify = require('../utils/telegramNotify');
        const Assignment = require('../models/Assignment');
        
        const assignment = await Assignment.findById(submission.assignmentId);
        const msgText = `Sizning "${assignment?.title}" topshirig'ingiz baholandi: ${score} ball.`;

        const newNotification = new Notification({
            recipient: submission.studentId,
            sender: req.user.id,
            courseId: submission.courseId,
            messageText: msgText
        });
        await newNotification.save();

        // Telegram bildirishnomasi
        await telegramNotify(submission.studentId, `🎓 <b>Topshiriq baholandi!</b>\n\nKurs: ${msgText}\n\n<i>Izoh: ${feedback || 'Izoh qoldirilmagan'}</i>`);

        res.json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
});

// 5. Get all submissions (grades) for a specific course (For Gradebook/Baholar tab)
router.get('/course/:courseId/grades', auth, async (req, res) => {
    try {
        const submissions = await Submission.find({ courseId: req.params.courseId })
            .populate('studentId', 'name')
            .populate('assignmentId', 'title maxScore');
        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
});

// 6. Get overall mastery stats for a teacher
router.get('/teacher/stats', auth, roleCheck(['teacher', 'super-admin']), async (req, res) => {
    try {
        const submissions = await Submission.find({ status: 'graded' })
            .populate({
                path: 'assignmentId',
                select: 'maxScore courseId',
                populate: {
                    path: 'courseId',
                    match: { teacher: req.user.id }
                }
            });

        // Filter out submissions where the course's teacher is not the current user
        const teacherSubmissions = submissions.filter(s => s.assignmentId && s.assignmentId.courseId);

        if (teacherSubmissions.length === 0) {
            return res.json({ averageMastery: 0, totalGraded: 0 });
        }

        let totalPercentage = 0;
        teacherSubmissions.forEach(s => {
            const max = s.assignmentId.maxScore || 100;
            const percentage = (s.score / max) * 100;
            totalPercentage += percentage;
        });

        const averageMastery = Math.round(totalPercentage / teacherSubmissions.length);

        res.json({ averageMastery, totalGraded: teacherSubmissions.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server xatosi", error: error.message });
    }
});

module.exports = router;
