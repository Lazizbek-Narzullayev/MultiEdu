const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const QuizResult = require('../models/QuizResult');

// @route   POST api/quiz-results
// @desc    Save a quiz result
// @access  Private (Student)
router.post('/', auth, async (req, res) => {
    const { lessonId, courseId, score, totalQuestions, correctAnswers } = req.body;

    try {
        const newResult = new QuizResult({
            student: req.user.id,
            lesson: lessonId,
            course: courseId || null,
            score,
            totalQuestions,
            correctAnswers
        });

        const result = await newResult.save();
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi' });
    }
});

// @route   GET api/quiz-results/my-results
// @desc    Get current user's quiz results
// @access  Private
router.get('/my-results', auth, async (req, res) => {
    try {
        const results = await QuizResult.find({ student: req.user.id })
            .populate('lesson', 'title')
            .populate('course', 'title')
            .sort({ date: -1 });
        res.json(results);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi' });
    }
});

module.exports = router;
