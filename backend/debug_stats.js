const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const LessonProgress = require('./models/LessonProgress');
const QuizResult = require('./models/QuizResult');
const Submission = require('./models/Submission');

const debugData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const courses = await Course.find().populate('teacher', 'name email');
        console.log(`Total courses found: ${courses.length}`);

        for (const course of courses) {
            console.log(`\n--- Course: ${course.title} (${course._id}) ---`);
            const lessons = await Lesson.find({ course: course._id });
            console.log(`Lessons found: ${lessons.length}`);
            lessons.forEach(l => console.log(`  - Lesson: ${l.title} (${l._id})`));

            console.log(`Students enrolled: ${course.students.length}`);
            for (const studentId of course.students) {
                const student = await User.findById(studentId);
                if (!student) {
                    console.log(`  - Student ID ${studentId} NOT FOUND`);
                    continue;
                }

                const viewed = await LessonProgress.countDocuments({ 
                    student: studentId, 
                    lesson: { $in: lessons.map(l => l._id) } 
                });
                
                const quiz = await QuizResult.countDocuments({ 
                    student: studentId, 
                    lesson: { $in: lessons.map(l => l._id) } 
                });

                const subs = await Submission.countDocuments({ 
                    studentId: studentId, 
                    courseId: course._id 
                });

                console.log(`  - Student: ${student.name} (${studentId})`);
                console.log(`    Viewed: ${viewed}/${lessons.length}`);
                console.log(`    Quiz Results: ${quiz}`);
                console.log(`    Submissions: ${subs}`);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

debugData();
