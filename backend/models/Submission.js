const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    fileUrl: {
        type: String
    },
    text: {
        type: String
    },
    score: {
        type: Number,
        default: null
    },
    feedback: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'graded'],
        default: 'pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    gradedAt: {
        type: Date
    }
});

module.exports = mongoose.model('Submission', submissionSchema);
