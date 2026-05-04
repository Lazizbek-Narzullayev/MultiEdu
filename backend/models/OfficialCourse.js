const mongoose = require('mongoose');

const OfficialCourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    sequence: {
        type: Number,
        default: 0,
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfficialLesson',
    }],
    topics: [{
        title: { type: String, required: true },
        description: { type: String },
        sequence: { type: Number, default: 0 },
        lessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OfficialLesson',
        }],
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('OfficialCourse', OfficialCourseSchema);
