const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['super-admin', 'teacher', 'student'],
        default: 'student',
    },
    telegramId: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null values for unique field
    },
    telegramToken: {
        type: String,
    },
    telegramTokenExpires: {
        type: Date,
    },
    timeSpent: {
        type: Number,
        default: 0, // in seconds
    },
    lastLesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
