const express = require('express');
const router = express.Router();
const { auth, isOwner, isRenter } = require('../middleware/auth');
const { createBooking, getUserBookings, getOwnerBookings, updateBookingStatus } = require('../controllers/bookingController');

// @route  POST /api/bookings
// @desc   Create a booking (renter)
// @access Private
router.post('/', auth, createBooking);

// @route  GET /api/bookings/user
// @desc   Get bookings for the logged-in renter
// @access Private
router.get('/user', auth, getUserBookings);

// @route  GET /api/bookings/owner
// @desc   Get bookings for spaces owned by the logged-in owner
// @access Private (owner)
router.get('/owner', auth, isOwner, getOwnerBookings);

// @route  PATCH /api/bookings/:id
// @desc   Approve or reject a booking
// @access Private (owner)
router.patch('/:id', auth, isOwner, updateBookingStatus);

module.exports = router;
