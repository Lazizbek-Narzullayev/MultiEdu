const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    textContent: {
        type: String, // Matnli ma'ruza
    },
    videoUrl: {
        type: String, // YouTube yoki boshqa video havola
    },
    audioUrl: {
        type: String, // Audio/Podkast fayli uchun havola
    },
    interactiveUrl: {
        type: String, // Simulyatsiya yoki interaktiv element havolasi
    },
    model3dUrl: {
        type: String, // 3D model (GLB/GLTF) havolasi
    },
    documentUrl: {
        type: String, // PDF, Word, PPTX hujjatlar uchun havola
    },
    thumbnailUrl: {
        type: String, // Muqova rasmi
    },
    category: {
        type: String,
        default: "Raqamli texnologiyalar tushunchasi"
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: null
    },
    sequence: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now,
    },
    transcript: {
        type: String,
        required: true // Multimodallik uchun majburiy
    },
    quiz: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true } // Index of options array
    }]
});

module.exports = mongoose.model('Lesson', LessonSchema);
