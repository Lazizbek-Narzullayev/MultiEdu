const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google DNS (8.8.8.8) to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');

// Local MongoDB Connection URL
const localUri = 'mongodb://127.0.0.1:27017/lms-db';
const atlasUri = process.argv[2];

if (!atlasUri) {
    console.error("\x1b[31mXATO: Iltimos, MongoDB Atlas URL-ni argument sifatida yuboring!\x1b[0m");
    console.log("Misol uchun:");
    console.log('node migrate_local_to_atlas.js "mongodb+srv://admin:parol@cluster.mongodb.net/lms-db"');
    process.exit(1);
}

async function run() {
    let localData = {
        users: [],
        courses: [],
        lessons: []
    };

    console.log("\n\x1b[36m=== 1-QADAM: Local ma'lumotlar bazasiga ulanish ===\x1b[0m");
    try {
        await mongoose.connect(localUri);
        console.log("\x1b[32m✔ Local MongoDB ga ulanish muvaffaqiyatli amalga oshdi!\x1b[0m");

        // Fetch all local data
        localData.users = await User.find({});
        localData.courses = await Course.find({});
        localData.lessons = await Lesson.find({});

        console.log(`\n\x1b[35mLocal bazadagi ma'lumotlar:\x1b[0m`);
        console.log(`- Foydalanuvchilar (Users) soni: ${localData.users.length}`);
        console.log(`- Sinflar/Kurslar (Courses) soni: ${localData.courses.length}`);
        console.log(`- Darslar (Lessons) soni: ${localData.lessons.length}`);

        if (localData.courses.length === 0 && localData.lessons.length === 0) {
            console.log("\x1b[33m⚠ Local bazada hech qanday ma'lumot topilmadi. Migratsiya bekor qilindi.\x1b[0m");
            await mongoose.disconnect();
            process.exit(0);
        }

        // Close local connection
        await mongoose.disconnect();
        console.log("\x1b[32m✔ Local MongoDB dan uzilish muvaffaqiyatli yakunlandi.\x1b[0m");
    } catch (err) {
        console.error("\x1b[31mLocal bazadan ma'lumot o'qishda xatolik:\x1b[0m", err);
        process.exit(1);
    }

    console.log("\n\x1b[36m=== 2-QADAM: MongoDB Atlas (Cloud) bazasiga ulanish ===\x1b[0m");
    try {
        await mongoose.connect(atlasUri);
        console.log("\x1b[32m✔ MongoDB Atlas (Cloud) ga ulanish muvaffaqiyatli amalga oshdi!\x1b[0m");

        const userIdMap = {}; // Maps: localUserId -> atlasUserId
        const courseIdMap = {}; // Maps: localCourseId -> atlasCourseId
        const lessonIdMap = {}; // Maps: localLessonId -> atlasLessonId

        console.log("\n\x1b[36m=== 3-QADAM: Foydalanuvchilarni migratsiya qilish ===\x1b[0m");
        for (const localUser of localData.users) {
            // Check if user already exists in Atlas by email
            let atlasUser = await User.findOne({ email: localUser.email });
            if (!atlasUser) {
                console.log(`+ Yangi foydalanuvchi yaratilmoqda: ${localUser.name} (${localUser.role})`);
                const userData = localUser.toObject();
                delete userData._id; // Let Mongo generate new ID
                atlasUser = new User(userData);
                await atlasUser.save();
            } else {
                console.log(`= Foydalanuvchi allaqachon mavjud: ${localUser.name} (${localUser.role})`);
            }
            userIdMap[localUser._id.toString()] = atlasUser._id.toString();
        }

        console.log("\n\x1b[36m=== 4-QADAM: Sinflar/Kurslarni migratsiya qilish ===\x1b[0m");
        for (const localCourse of localData.courses) {
            // Check if course already exists in Atlas by joinCode or title
            let atlasCourse = await Course.findOne({ 
                $or: [{ joinCode: localCourse.joinCode }, { title: localCourse.title }] 
            });

            if (!atlasCourse) {
                console.log(`+ Yangi Kurs yaratilmoqda: "${localCourse.title}"`);
                const courseData = localCourse.toObject();
                delete courseData._id;
                delete courseData.lessons; // We will link newly migrated lessons later
                delete courseData.students; // Reset student list for new database

                // Remap teacher ID
                const oldTeacherId = localCourse.teacher.toString();
                courseData.teacher = userIdMap[oldTeacherId] || oldTeacherId;

                atlasCourse = new Course(courseData);
                await atlasCourse.save();
            } else {
                console.log(`= Kurs allaqachon mavjud: "${localCourse.title}"`);
            }
            courseIdMap[localCourse._id.toString()] = atlasCourse._id.toString();
        }

        console.log("\n\x1b[36m=== 5-QADAM: Darslarni migratsiya qilish ===\x1b[0m");
        for (const localLesson of localData.lessons) {
            // Check if lesson already exists in Atlas by title
            let atlasLesson = await Lesson.findOne({ title: localLesson.title });

            if (!atlasLesson) {
                console.log(`+ Yangi dars yaratilmoqda: "${localLesson.title}"`);
                const lessonData = localLesson.toObject();
                delete lessonData._id;

                // Safely handle missing transcript fields in legacy local lessons
                if (!lessonData.transcript) {
                    lessonData.transcript = lessonData.description || "Dars transkripti mavjud emas.";
                }

                // Remap instructor ID
                const oldInstructorId = localLesson.instructor.toString();
                lessonData.instructor = userIdMap[oldInstructorId] || oldInstructorId;

                // Remap course ID if linked
                if (localLesson.course) {
                    const oldCourseId = localLesson.course.toString();
                    lessonData.course = courseIdMap[oldCourseId] || null;
                }

                atlasLesson = new Lesson(lessonData);
                await atlasLesson.save();
            } else {
                console.log(`= Dars allaqachon mavjud: "${localLesson.title}"`);
            }
            lessonIdMap[localLesson._id.toString()] = atlasLesson._id.toString();
        }

        console.log("\n\x1b[36m=== 6-QADAM: Kurslar va Darslar orasidagi bog'liqliklarni tiklash ===\x1b[0m");
        for (const localCourse of localData.courses) {
            const atlasCourseId = courseIdMap[localCourse._id.toString()];
            if (atlasCourseId) {
                const mappedLessonIds = [];
                for (const oldLessonId of (localCourse.lessons || [])) {
                    const newLessonId = lessonIdMap[oldLessonId.toString()];
                    if (newLessonId) {
                        mappedLessonIds.push(new mongoose.Types.ObjectId(newLessonId));
                    }
                }

                if (mappedLessonIds.length > 0) {
                    await Course.findByIdAndUpdate(atlasCourseId, {
                        $set: { lessons: mappedLessonIds }
                    });
                    console.log(`✔ "${localCourse.title}" kursiga ${mappedLessonIds.length} ta dars qaytadan muvaffaqiyatli bog'landi!`);
                }
            }
        }

        console.log("\n\x1b[32m✔ MIGRATSIYA TO'LIQ VA MUVAFFARIYATLI YAKUNLANDI!\x1b[0m");
        console.log("\x1b[35mBarcha local darslar va sinflaringiz live saytingizga (MongoDB Atlas) ko'chirildi.\x1b[0m\n");

        await mongoose.disconnect();
    } catch (err) {
        console.error("\x1b[31mAtlas bazaga yozishda xatolik:\x1b[0m", err);
        process.exit(1);
    }
}

run();
