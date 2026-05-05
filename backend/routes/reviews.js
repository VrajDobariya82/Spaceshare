const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { createReview, getSpaceReviews } = require('../controllers/reviewController');

// @route  POST /api/reviews
// @desc   Create a review (authenticated users with approved bookings)
router.post('/', auth, createReview);

// @route  GET /api/reviews/:spaceId
// @desc   Get all reviews for a space
router.get('/:spaceId', getSpaceReviews);

module.exports = router;
