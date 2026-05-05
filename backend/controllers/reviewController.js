const Review = require('../models/Review');
const Space = require('../models/Space');
const Booking = require('../models/Booking');

// @desc    Create a review for a space
// @route   POST /api/reviews
const createReview = async (req, res, next) => {
    try {
        const { spaceId, rating, comment } = req.body;

        if (!spaceId || !rating) {
            return res.status(400).json({ message: 'spaceId and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check that the space exists
        const space = await Space.findById(spaceId);
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }

        // Check that the user has a completed/approved booking for this space
        const hasBooking = await Booking.findOne({
            userId: req.user.id,
            spaceId,
            status: 'approved'
        });

        if (!hasBooking) {
            return res.status(400).json({ message: 'You can only review spaces you have booked' });
        }

        // Check for existing review
        const existing = await Review.findOne({ userId: req.user.id, spaceId });
        if (existing) {
            return res.status(400).json({ message: 'You have already reviewed this space' });
        }

        const review = new Review({
            userId: req.user.id,
            spaceId,
            rating: Number(rating),
            comment: comment || ''
        });

        const saved = await review.save();
        const populated = await saved.populate('userId', 'name');
        res.status(201).json(populated);
    } catch (err) {
        next(err);
    }
};

// @desc    Get reviews for a space + average rating
// @route   GET /api/reviews/:spaceId
const getSpaceReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ spaceId: req.params.spaceId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        res.json({
            reviews,
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: reviews.length
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { createReview, getSpaceReviews };
