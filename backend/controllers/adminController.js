const User = require('../models/User');
const Space = require('../models/Space');
const Booking = require('../models/Booking');

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all spaces (admin)
// @route   GET /api/admin/spaces
const getAllSpaces = async (req, res, next) => {
    try {
        const spaces = await Space.find()
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 });
        res.json(spaces);
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a space (admin)
// @route   DELETE /api/admin/spaces/:id
const deleteSpace = async (req, res, next) => {
    try {
        const space = await Space.findById(req.params.id);
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }

        await Space.findByIdAndDelete(req.params.id);
        res.json({ message: 'Space deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate('spaceId', 'title location price type')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllUsers, deleteUser, getAllSpaces, deleteSpace, getAllBookings };
