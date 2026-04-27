const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');

// @route   POST api/quizzes
// @desc    Create a new quiz
// @access  Private (Teacher)
router.post('/', auth, async (req, res) => {
    const { title, description, courseId, questions } = req.body;

    try {
        // 1. Verify user is a teacher
        if (req.user.role !== 'teacher' && req.user.role !== 'super-admin') {
            return res.status(403).json({ msg: 'Sizda test yaratish huquqi yo\'q' });
        }

        // 2. Verify course exists and belongs to the teacher
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Kurs topilmadi' });
        }
        if (course.teacher.toString() !== req.user.id && req.user.role !== 'super-admin') {
            return res.status(403).json({ msg: 'Siz faqat o\'z kursingizga test qo\'sha olasiz' });
        }

        // 3. Create Quiz
        const newQuiz = new Quiz({
            title,
            description,
            course: courseId,
            teacher: req.user.id,
            questions
        });

        const quiz = await newQuiz.save();
        res.json(quiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   GET api/quizzes/course/:courseId
// @desc    Get all quizzes for a specific course
// @access  Private (Teacher or Enrolled Student)
router.get('/course/:courseId', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Kurs topilmadi' });
        }

        const isOwner = course.teacher.toString() === req.user.id;
        const isJoined = course.students.includes(req.user.id);
        const isSuperAdmin = req.user.role === 'super-admin';

        if (!isOwner && !isJoined && !isSuperAdmin) {
            return res.status(403).json({ msg: 'Siz bu kursga a\'zo emassiz' });
        }

        // Select specific fields to not send answers to students immediately in the list view
        const quizzes = await Quiz.find({ course: req.params.courseId })
            .select('-questions.correctOptionIndex');

        // Get attempts if the user is a student to show if they completed it
        let attemptsMap = {};
        if (isJoined && !isOwner) {
            const attempts = await QuizAttempt.find({ course: req.params.courseId, student: req.user.id });
            attempts.forEach(a => {
                attemptsMap[a.quiz.toString()] = a;
            });
        }

        res.json({ quizzes, attempts: attemptsMap });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   GET api/quizzes/:id
// @desc    Get complete quiz data (Teacher gets answers, students only questions)
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ msg: 'Test topilmadi' });
        }

        const course = await Course.findById(quiz.course);
        const isOwner = course.teacher.toString() === req.user.id;
        const isSuperAdmin = req.user.role === 'super-admin';

        if (isOwner || isSuperAdmin) {
            return res.json(quiz); // full data
        }

        // For students, check if completed first. If yes, they can't take it again (basic rule)
        const attempt = await QuizAttempt.findOne({ quiz: quiz._id, student: req.user.id });
        if (attempt) {
            return res.status(400).json({ msg: 'Siz bu testni allaqachon yetkunsiz', attempt });
        }

        // Strip correct answers
        const sanitizedQuiz = quiz.toObject();
        sanitizedQuiz.questions.forEach(q => {
            delete q.correctOptionIndex;
        });

        res.json(sanitizedQuiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   POST api/quizzes/:id/submit
// @desc    Submit a quiz and calculate score
// @access  Private (Student)
router.post('/:id/submit', auth, async (req, res) => {
    try {
        const { answers } = req.body; // Array of { questionId, selectedOptionIndex }

        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ msg: 'Test topilmadi' });

        // Check if already attempted
        const existingAttempt = await QuizAttempt.findOne({ quiz: quiz._id, student: req.user.id });
        if (existingAttempt) {
            return res.status(400).json({ msg: 'Siz bu testni allaqachon yetkunsiz' });
        }

        let score = 0;
        const processedAnswers = [];

        quiz.questions.forEach(question => {
            const studentAnswer = answers.find(a => a.questionId === question._id.toString());
            const isCorrect = studentAnswer && studentAnswer.selectedOptionIndex === question.correctOptionIndex;

            if (isCorrect) {
                score++;
            }

            processedAnswers.push({
                questionId: question._id,
                selectedOptionIndex: studentAnswer ? studentAnswer.selectedOptionIndex : -1, // -1 means no answer
                isCorrect: isCorrect || false
            });
        });

        const newAttempt = new QuizAttempt({
            quiz: quiz._id,
            student: req.user.id,
            course: quiz.course,
            score,
            totalQuestions: quiz.questions.length,
            answers: processedAnswers
        });

        await newAttempt.save();

        res.json({
            msg: 'Test qabul qilindi',
            score,
            totalQuestions: quiz.questions.length,
            attemptId: newAttempt._id
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   GET api/quizzes/:id/results
// @desc    Get quiz results (Teacher gets all, student gets personal)
// @access  Private
router.get('/:id/results', auth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ msg: 'Test topilmadi' });

        const course = await Course.findById(quiz.course);
        const isOwner = course.teacher.toString() === req.user.id;
        const isSuperAdmin = req.user.role === 'super-admin';

        if (isOwner || isSuperAdmin) {
            const attempts = await QuizAttempt.find({ quiz: req.params.id }).populate('student', 'name email');
            return res.json(attempts);
        } else {
            const attempt = await QuizAttempt.findOne({ quiz: req.params.id, student: req.user.id });
            return res.json(attempt);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   GET api/quizzes/course/:courseId/all-results
// @desc    Get all quiz results for all students in a course (Teacher only)
router.get('/course/:courseId/all-results', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ msg: 'Kurs topilmadi' });

        const isOwner = course.teacher.toString() === req.user.id;
        const isSuperAdmin = req.user.role === 'super-admin';

        if (!isOwner && !isSuperAdmin) {
            return res.status(403).json({ msg: 'Faqat o\'qituvchi barcha natijalarni ko\'ra oladi' });
        }

        const attempts = await QuizAttempt.find({ course: req.params.courseId })
            .populate('student', 'name email');
        
        res.json(attempts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

module.exports = router;
