const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Space = require('../models/Space');

// Simple auth middleware – extracts user from token
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded.user; // { id, role }
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// @route  POST /api/spaces
// @desc   Create a new space (owner only)
router.post('/', auth, async (req, res) => {
    try {
        // Basic role check
        if (req.user.role !== 'owner') {
            return res.status(403).json({ message: 'Only owners can add spaces' });
        }

        const { title, location, price, description } = req.body;

        if (!title || !location || !price) {
            return res.status(400).json({ message: 'Title, location and price are required' });
        }

        const space = new Space({
            title,
            location,
            price,
            description: description || '',
            ownerId: req.user.id
        });

        const saved = await space.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  GET /api/spaces
// @desc   Get all spaces
router.get('/', async (req, res) => {
    try {
        const spaces = await Space.find().sort({ createdAt: -1 });
        res.json(spaces);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  GET /api/spaces/my
// @desc   Get spaces owned by the logged-in user
router.get('/my', auth, async (req, res) => {
    try {
        const spaces = await Space.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
        res.json(spaces);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
