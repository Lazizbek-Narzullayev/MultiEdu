const mongoose = require('mongoose');

const MutedLessonSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    mutedAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a user can only mute a lesson once (unique compound index)
MutedLessonSchema.index({ user: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('MutedLesson', MutedLessonSchema);
