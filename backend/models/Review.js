const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Space',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate reviews from the same user on the same space
ReviewSchema.index({ userId: 1, spaceId: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
