const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lesson = require('../models/Lesson');
const LessonProgress = require('../models/LessonProgress');

// @route   GET api/lessons/progress
// @desc    Get user's completed lessons
// @access  Private (Authenticated)
router.get('/my-progress', auth, async (req, res) => {
    console.log('--- MY-PROGRESS so\'rovi keldi ---');
    try {
        const progress = await LessonProgress.find({ student: req.user.id });
        const completedLessonIds = progress.map(p => p.lesson);
        res.json(completedLessonIds);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   GET api/lessons
// @desc    Get all public nation-wide lessons
// @access  Private (Authenticated)
router.get('/', auth, async (req, res) => {
    try {
        const lessons = await Lesson.find({ course: null }).sort({ sequence: 1, date: 1 }).populate('instructor', 'name email');
        res.json(lessons);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   POST api/lessons
// @desc    Add a new lesson
// @access  Private (Teacher / Super Admin)
router.post('/', auth, async (req, res) => {
    const { title, description, textContent, videoUrl, audioUrl, interactiveUrl, model3dUrl, documentUrl, thumbnailUrl, category, courseId, transcript, quiz } = req.body;

    // Check mandatory fields for multimodality
    if (!title || !description || !textContent || !videoUrl || !audioUrl || !documentUrl || !thumbnailUrl || !transcript) {
        return res.status(400).json({ msg: 'Iltimos, barcha majburiy maydonlarni to\'ldiring (Video, Audio, Matn, Hujjat, Muqova va Transkript majburiy)' });
    }

    if (req.user.role === 'student') {
        return res.status(403).json({ msg: 'Sizda dars qo\'shish huquqi yo\'q' });
    }

    try {
        const newLesson = new Lesson({
            title,
            description,
            textContent,
            videoUrl,
            audioUrl,
            interactiveUrl,
            model3dUrl,
            documentUrl,
            thumbnailUrl,
            category,
            transcript,
            quiz,
            instructor: req.user.id,
            course: courseId || null
        });

        const lesson = await newLesson.save();
        res.json(lesson);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   PUT api/lessons/:id
// @desc    Update a lesson
// @access  Private (Owner / Admin / Super Admin)
router.put('/:id', auth, async (req, res) => {
    const { title, description, textContent, videoUrl, audioUrl, interactiveUrl, model3dUrl, documentUrl, thumbnailUrl, category, transcript, quiz } = req.body;

    // Check mandatory fields for multimodality
    if (!title || !description || !textContent || !videoUrl || !audioUrl || !documentUrl || !thumbnailUrl || !transcript) {
        return res.status(400).json({ msg: 'Iltimos, barcha majburiy maydonlarni to\'ldiring' });
    }

    try {
        let lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ msg: 'Dars topilmadi' });

        // Access check
        if (lesson.instructor.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
            return res.status(401).json({ msg: 'Sizda bu darsni tahrirlash huquqi yo\'q' });
        }

        const updateData = {
            title, description, textContent, videoUrl, audioUrl, interactiveUrl, 
            model3dUrl, documentUrl, thumbnailUrl, category, transcript, quiz
        };

        lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        res.json(lesson);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   GET api/lessons/:id
// @desc    Get lesson by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate('instructor', 'name email');
        if (!lesson) {
            return res.status(404).json({ msg: 'Dars topilmadi' });
        }
        res.json(lesson);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Dars topilmadi' });
        }
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   DELETE api/lessons/:id
// @desc    Delete a lesson
// @access  Private (Owner / Admin / Super Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ msg: 'Dars topilmadi' });
        }

        // Faqat o'sha o'qituvchi, admin yoki super-admin o'chira oladi
        if (lesson.instructor.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
            return res.status(401).json({ msg: 'Sizda bu darsni o\'chirish huquqi yo\'q' });
        }

        await Lesson.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Dars o\'chirildi' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   PATCH api/lessons/:id/view
// @desc    Mark a lesson as viewed
// @access  Private (Student)
router.patch('/:id/view', auth, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ msg: 'Dars topilmadi' });
        }

        // Check if progress already exists
        let progress = await LessonProgress.findOne({
            student: req.user.id,
            lesson: req.params.id
        });

        if (progress) {
            return res.json(progress);
        }

        progress = new LessonProgress({
            student: req.user.id,
            lesson: req.params.id,
            course: lesson.course
        });

        await progress.save();
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

module.exports = router;
