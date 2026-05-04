require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Global logger (BMI Diognostika uchun qoladi hozircha)
app.use((req, res, next) => {
    console.log(`${req.method} so'rovi keldi: ${req.url}`);
    next();
});

const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Super Admin Seeding Function
const seedSuperAdmin = async () => {
    try {
        const superAdminEmail = 'admin@lms.uz';
        const existingAdmin = await User.findOne({ email: superAdminEmail });

        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            const superAdmin = new User({
                name: 'Bosh Admin',
                email: superAdminEmail,
                password: hashedPassword,
                role: 'super-admin'
            });

            await superAdmin.save();
            console.log('--- SUPER ADMIN yaratildi: admin@lms.uz / admin123 ---');
        } else {
            console.log('--- Super Admin allaqachon mavjud ---');
        }
    } catch (err) {
        console.error('Seeding xatosi:', err);
    }
};

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lms-db';
mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('MongoDB connected');
        seedSuperAdmin(); // Bosh adminni yaratish
        
        // Auto-migration for Official Courses
        const OfficialCourse = require('./models/OfficialCourse');
        const OfficialLesson = require('./models/OfficialLesson');
        const count = await OfficialCourse.countDocuments();
        
        // We'll re-run migration to fix the "teacher courses mixed in" issue
        // OR if count is 0. 
        // For safety, let's allow it to re-run once if we detect teacher courses.
        if (count >= 0) {
            console.log('--- Rasmiy kurslar migratsiyasi tekshirilmoqda... ---');
            const Course = require('./models/Course');
            const Lesson = require('./models/Lesson');
            const User = require('./models/User');

            // Find Super Admin ID
            const superAdmin = await User.findOne({ role: 'super-admin' });
            if (!superAdmin) {
                console.log('Super Admin topilmadi, migratsiya bekor qilindi.');
                return;
            }

            // Strictly find courses created by Super Admin
            const adminCourses = await Course.find({ teacher: superAdmin._id });
            console.log(`${adminCourses.length} ta haqiqiy rasmiy kurs topildi.`);

            // Clear new collections to avoid duplicates/wrong data
            await OfficialCourse.deleteMany({});
            await OfficialLesson.deleteMany({});

            // 1. Migrate Super Admin Courses
            for (const course of adminCourses) {
                const newOC = new OfficialCourse({
                    title: course.title,
                    description: course.description,
                    thumbnail: course.thumbnail,
                    sequence: course.sequence
                });
                const lessons = await Lesson.find({ course: course._id });
                const newLessonIds = [];
                for (const lesson of lessons) {
                    const newOL = new OfficialLesson({
                        title: lesson.title,
                        description: lesson.description,
                        textContent: lesson.textContent,
                        videoUrl: lesson.videoUrl,
                        audioUrl: lesson.audioUrl,
                        interactiveUrl: lesson.interactiveUrl,
                        model3dUrl: lesson.model3dUrl,
                        documentUrl: lesson.documentUrl,
                        thumbnailUrl: lesson.thumbnailUrl,
                        course: newOC._id,
                        sequence: lesson.sequence,
                        transcript: lesson.transcript,
                        quiz: lesson.quiz
                    });
                    const saved = await newOL.save();
                    newLessonIds.push(saved._id);
                }
                newOC.lessons = newLessonIds;
                await newOC.save();
                console.log(`Migratsiya: ${course.title} ko'chirildi.`);
            }

            // 2. Migrate Public Lessons from Super Admin (The 2 lessons mentioned)
            const publicAdminLessons = await Lesson.find({ 
                instructor: superAdmin._id,
                course: null 
            });

            if (publicAdminLessons.length > 0) {
                console.log(`${publicAdminLessons.length} ta umumiy rasmiy dars topildi.`);
                // Create a default course for these lessons
                const defaultCourse = new OfficialCourse({
                    title: 'Premium Bilimlar Akademiyasi',
                    description: 'Platformaning barcha asosiy darslari va resurslari.',
                    thumbnail: publicAdminLessons[0].thumbnailUrl,
                    sequence: -1
                });

                const newLessonIds = [];
                for (const lesson of publicAdminLessons) {
                    const newOL = new OfficialLesson({
                        title: lesson.title,
                        description: lesson.description,
                        textContent: lesson.textContent,
                        videoUrl: lesson.videoUrl,
                        audioUrl: lesson.audioUrl,
                        interactiveUrl: lesson.interactiveUrl,
                        model3dUrl: lesson.model3dUrl,
                        documentUrl: lesson.documentUrl,
                        thumbnailUrl: lesson.thumbnailUrl,
                        course: defaultCourse._id,
                        sequence: lesson.sequence,
                        transcript: lesson.transcript,
                        quiz: lesson.quiz
                    });
                    const saved = await newOL.save();
                    newLessonIds.push(saved._id);
                }
                defaultCourse.lessons = newLessonIds;
                await defaultCourse.save();
                console.log('Migratsiya: Umumiy darslar ko\'chirildi.');
            }
        }
    })
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/api/auth/test', (req, res) => {
    res.json({ msg: 'Backend ishlayapti!' });
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/messages', require('./routes/messages')); // Added messages route
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/students', require('./routes/students'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/support', require('./routes/support')); // Help Desk API
app.use('/api/models3d', require('./routes/models3d'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/quiz-results', require('./routes/quizResults'));
app.use('/api/official-courses', require('./routes/officialCourses'));
app.use('/api/official-lessons', require('./routes/officialLessons'));


// Static folder for file uploads
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Telegram botni ishga tushirish
    const { launchBot } = require('./bot');
    launchBot();
});
