const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');

// Simple auth middleware
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// @route  POST /api/bookings
// @desc   Book a space (any logged-in user, typically renter)
router.post('/', auth, async (req, res) => {
    try {
        const { spaceId } = req.body;

        if (!spaceId) {
            return res.status(400).json({ message: 'spaceId is required' });
        }

        const booking = new Booking({
            userId: req.user.id,
            spaceId
        });

        const saved = await booking.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
