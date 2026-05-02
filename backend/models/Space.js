const mongoose = require('mongoose');

const SpaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    images: [{
        type: String // Cloudinary URLs
    }],
    type: {
        type: String,
        enum: ['room', 'office', 'storage', 'event'],
        default: 'room'
    },
    availability: {
        type: Boolean,
        default: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Space', SpaceSchema);
