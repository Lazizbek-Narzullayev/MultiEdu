const mongoose = require('mongoose');

const OfficialLessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    textContent: {
        type: String,
    },
    videoUrl: {
        type: String,
    },
    audioUrl: {
        type: String,
    },
    interactiveUrl: {
        type: String,
    },
    model3dUrl: {
        type: String,
    },
    documentUrl: {
        type: String,
    },
    thumbnailUrl: {
        type: String,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfficialCourse',
        required: true
    },
    sequence: {
        type: Number,
        default: 0
    },
    transcript: {
        type: String,
    },
    quiz: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true }
    }],
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('OfficialLesson', OfficialLessonSchema);
