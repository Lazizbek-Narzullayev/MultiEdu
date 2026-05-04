const mongoose = require('mongoose');
require('dotenv').config();

const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const OfficialCourse = require('./models/OfficialCourse');
const OfficialLesson = require('./models/OfficialLesson');

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lms-db');
        console.log('Migratsiya boshlandi...');

        const officialCourses = await Course.find({ isOfficial: true });
        console.log(`${officialCourses.length} ta rasmiy kurs topildi.`);

        for (const course of officialCourses) {
            // 1. Create Official Course
            const newOfficialCourse = new OfficialCourse({
                title: course.title,
                description: course.description,
                thumbnail: course.thumbnail,
                sequence: course.sequence,
                createdAt: course.createdAt
            });

            // 2. Find lessons for this course
            const lessons = await Lesson.find({ course: course._id });
            console.log(`Course "${course.title}" uchun ${lessons.length} ta dars ko'chirilmoqda...`);

            const newLessonIds = [];
            for (const lesson of lessons) {
                const newOfficialLesson = new OfficialLesson({
                    title: lesson.title,
                    description: lesson.description,
                    textContent: lesson.textContent,
                    videoUrl: lesson.videoUrl,
                    audioUrl: lesson.audioUrl,
                    interactiveUrl: lesson.interactiveUrl,
                    model3dUrl: lesson.model3dUrl,
                    documentUrl: lesson.documentUrl,
                    thumbnailUrl: lesson.thumbnailUrl,
                    course: newOfficialCourse._id,
                    sequence: lesson.sequence,
                    transcript: lesson.transcript,
                    quiz: lesson.quiz,
                    date: lesson.date
                });
                const savedLesson = await newOfficialLesson.save();
                newLessonIds.push(savedLesson._id);
            }

            newOfficialCourse.lessons = newLessonIds;
            await newOfficialCourse.save();
            console.log(`Course "${course.title}" muvaffaqiyatli ko'chirildi.`);
        }

        console.log('Migratsiya yakunlandi.');
        process.exit(0);
    } catch (err) {
        console.error('Migratsiya xatosi:', err);
        process.exit(1);
    }
};

migrate();
