const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate favorites
FavoriteSchema.index({ userId: 1, spaceId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
