const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    joinCode: {
        type: String,
        unique: true,
        required: true,
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    thumbnail: {
        type: String,
    },
    isOfficial: {
        type: Boolean,
        default: false,
    },
    sequence: {
        type: Number,
        default: 0,
    },
    topics: [{
        title: { type: String, required: true },
        description: { type: String },
        sequence: { type: Number, default: 0 },
        lessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson',
        }],
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Course', CourseSchema);
