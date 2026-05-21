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
    const { title, description, textContent, videoUrl, audioUrl, interactiveUrl, model3dUrl, documentUrl, thumbnailUrl, category, courseId, transcript, quiz, documents } = req.body;

    // Check mandatory fields (allow either documents array with at least one item or documentUrl)
    const hasDocument = (documents && documents.length > 0) || documentUrl;
    if (!title || !description || !textContent || !videoUrl || !audioUrl || !thumbnailUrl || !transcript || !hasDocument) {
        return res.status(400).json({ msg: "Iltimos, barcha majburiy maydonlarni to'ldiring (Video, Audio, Matn, Hujjat/URL, Muqova va Transkript majburiy)" });
    }

    if (req.user.role === 'student') {
        return res.status(403).json({ msg: 'Sizda dars qo'shish huquqi yo'q' });
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
            documents: documents || [],
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
// @desc    Update a lesson (Supports both regular and official lessons with auto-sync)
// @access  Private (Owner / Admin / Super Admin)
router.put('/:id', auth, async (req, res) => {
    const { title, description, textContent, videoUrl, audioUrl, interactiveUrl, model3dUrl, documentUrl, thumbnailUrl, category, transcript, quiz, documents } = req.body;

    // Check mandatory fields (allow either documents array with at least one item or documentUrl)
    const hasDocument = (documents && documents.length > 0) || documentUrl;
    if (!title || !description || !textContent || !videoUrl || !audioUrl || !thumbnailUrl || !transcript || !hasDocument) {
        return res.status(400).json({ msg: 'Iltimos, barcha majburiy maydonlarni to\'ldiring' });
    }

    try {
        let lesson = await Lesson.findById(req.params.id);
        let isOfficial = false;
        
        if (!lesson) {
            const OfficialLesson = require('../models/OfficialLesson');
            lesson = await OfficialLesson.findById(req.params.id);
            if (lesson) isOfficial = true;
        }

        if (!lesson) return res.status(404).json({ msg: 'Dars topilmadi' });

        // Access check
        const isAuthorized = req.user.role === 'admin' || req.user.role === 'super-admin' || 
            (lesson.instructor && lesson.instructor.toString() === req.user.id);

        if (!isAuthorized) {
            return res.status(401).json({ msg: 'Sizda bu darsni tahrirlash huquqi yo\'q' });
        }

        const updateData = {
            title, description, textContent, videoUrl, audioUrl, interactiveUrl, 
            model3dUrl, documentUrl, documents: documents || [], thumbnailUrl, category, transcript, quiz
        };

        if (isOfficial) {
            const OfficialLesson = require('../models/OfficialLesson');
            lesson = await OfficialLesson.findByIdAndUpdate(
                req.params.id,
                { $set: updateData },
                { new: true }
            );
            
            // Sync changes to Lesson collection if it exists under the same title
            await Lesson.findOneAndUpdate(
                { title: lesson.title },
                { $set: updateData }
            );
        } else {
            lesson = await Lesson.findByIdAndUpdate(
                req.params.id,
                { $set: updateData },
                { new: true }
            );

            // Sync changes to OfficialLesson collection if it exists under the same title
            const OfficialLesson = require('../models/OfficialLesson');
            await OfficialLesson.findOneAndUpdate(
                { title: lesson.title },
                { $set: updateData }
            );
        }

        res.json(lesson);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   GET api/lessons/:id
// @desc    Get lesson by ID (Checks both regular and official lessons)
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        let lesson = await Lesson.findById(req.params.id).populate('instructor', 'name email');
        
        // Fallback to OfficialLesson
        if (!lesson) {
            const OfficialLesson = require('../models/OfficialLesson');
            lesson = await OfficialLesson.findById(req.params.id);
        }

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
// @desc    Delete a lesson (Supports both regular and official lessons with cascade clean ups)
// @access  Private (Owner / Admin / Super Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        let lesson = await Lesson.findById(req.params.id);
        let isOfficial = false;

        if (!lesson) {
            const OfficialLesson = require('../models/OfficialLesson');
            lesson = await OfficialLesson.findById(req.params.id);
            if (lesson) isOfficial = true;
        }

        if (!lesson) {
            return res.status(404).json({ msg: 'Dars topilmadi' });
        }

        // Access check
        const isAuthorized = req.user.role === 'admin' || req.user.role === 'super-admin' || 
            (lesson.instructor && lesson.instructor.toString() === req.user.id);

        if (!isAuthorized) {
            return res.status(401).json({ msg: 'Sizda bu darsni o\'chirish huquqi yo\'q' });
        }

        if (isOfficial) {
            const OfficialLesson = require('../models/OfficialLesson');
            const OfficialCourse = require('../models/OfficialCourse');
            
            // Delete from OfficialLesson
            await OfficialLesson.findByIdAndDelete(req.params.id);
            
            // Clean up reference in OfficialCourse
            await OfficialCourse.updateMany(
                {},
                { $pull: { lessons: req.params.id, "topics.$[].lessons": req.params.id } }
            );

            // Delete from Lesson collection under same title if exists
            await Lesson.findOneAndDelete({ title: lesson.title });
        } else {
            // Delete from Lesson
            await Lesson.findByIdAndDelete(req.params.id);

            // Clean up OfficialLesson and OfficialCourse references under same title
            const OfficialLesson = require('../models/OfficialLesson');
            const OfficialCourse = require('../models/OfficialCourse');
            
            const offLesson = await OfficialLesson.findOne({ title: lesson.title });
            if (offLesson) {
                await OfficialLesson.findByIdAndDelete(offLesson._id);
                await OfficialCourse.updateMany(
                    {},
                    { $pull: { lessons: offLesson._id, "topics.$[].lessons": offLesson._id } }
                );
            }
        }

        res.json({ msg: 'Dars o\'chirildi' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// @route   PATCH api/lessons/:id/view
// @desc    Mark a lesson as viewed (Supports both regular and official lessons)
// @access  Private (Student)
router.patch('/:id/view', auth, async (req, res) => {
    try {
        let lesson = await Lesson.findById(req.params.id);
        let isOfficial = false;

        if (!lesson) {
            const OfficialLesson = require('../models/OfficialLesson');
            lesson = await OfficialLesson.findById(req.params.id);
            if (lesson) isOfficial = true;
        }

        if (!lesson) {
            return res.status(404).json({ msg: 'Dars topilmadi' });
        }

        const ProgressModel = isOfficial ? require('../models/OfficialLessonProgress') : require('../models/LessonProgress');

        // Check if progress already exists
        let progress = await ProgressModel.findOne({
            student: req.user.id,
            lesson: req.params.id
        });

        if (progress) {
            return res.json(progress);
        }

        progress = new ProgressModel({
            student: req.user.id,
            lesson: req.params.id,
            course: lesson.course
        });

        await progress.save();

        // Also update User's lastLesson (keeping it in User model for general tracking)
        const User = require('../models/User');
        // Note: lastLesson in User can point to either ID, but populate won't work easily if they are in different collections
        // However, we'll keep it for simple ID storage.
        await User.findByIdAndUpdate(req.user.id, { lastLesson: req.params.id });

        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

module.exports = router;
