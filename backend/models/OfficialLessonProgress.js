const mongoose = require('mongoose');

const OfficialLessonProgressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfficialLesson',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfficialCourse'
    },
    viewedAt: {
        type: Date,
        default: Date.now
    }
});

OfficialLessonProgressSchema.index({ student: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('OfficialLessonProgress', OfficialLessonProgressSchema);
