const Booking = require('../models/Booking');
const Space = require('../models/Space');
const { createNotification } = require('./notificationController');
const { sendBookingConfirmationEmail } = require('../utils/email');

// @desc    Create a new booking (renter)
// @route   POST /api/bookings
const createBooking = async (req, res, next) => {
    try {
        const { spaceId, startDate, endDate } = req.body;

        if (!spaceId || !startDate || !endDate) {
            return res.status(400).json({ message: 'spaceId, startDate and endDate are required' });
        }

        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // Check that the space exists and is available
        const space = await Space.findById(spaceId).populate('ownerId', 'name');
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }
        if (!space.availability) {
            return res.status(400).json({ message: 'Space is not currently available' });
        }

        const booking = new Booking({
            userId: req.user.id,
            spaceId,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });

        const saved = await booking.save();
        const populated = await saved.populate('spaceId', 'title location price images type');

        // Notify the space owner about the new booking request
        await createNotification(
            space.ownerId._id || space.ownerId,
            `New booking request for "${space.title}"`,
            'booking_request',
            saved._id
        );

        res.status(201).json(populated);
    } catch (err) {
        next(err);
    }
};

// @desc    Get bookings for the logged-in renter
// @route   GET /api/bookings/user
const getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('spaceId', 'title location price images type ownerId')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        next(err);
    }
};

// @desc    Get bookings for spaces owned by the logged-in owner
// @route   GET /api/bookings/owner
const getOwnerBookings = async (req, res, next) => {
    try {
        // First find all spaces owned by this user
        const mySpaces = await Space.find({ ownerId: req.user.id }).select('_id');
        const spaceIds = mySpaces.map(s => s._id);

        const bookings = await Booking.find({ spaceId: { $in: spaceIds } })
            .populate('spaceId', 'title location price images type')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        next(err);
    }
};

// @desc    Approve or reject a booking (owner)
// @route   PATCH /api/bookings/:id
const updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be "approved" or "rejected"' });
        }

        const booking = await Booking.findById(req.params.id).populate('spaceId', 'ownerId title');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify the logged-in user owns the space
        if (booking.spaceId.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        booking.status = status;
        await booking.save();

        // Re-populate for response
        const updated = await Booking.findById(booking._id)
            .populate('spaceId', 'title location price images type')
            .populate('userId', 'name email');

        // Notify the renter about the booking status
        const statusText = status === 'approved' ? 'approved ✅' : 'rejected ❌';
        await createNotification(
            booking.userId,
            `Your booking for "${booking.spaceId.title}" has been ${statusText}`,
            status === 'approved' ? 'booking_approved' : 'booking_rejected',
            booking._id
        );

        // Send email on approval
        if (status === 'approved' && updated.userId) {
            sendBookingConfirmationEmail(
                updated.userId.email,
                updated.userId.name,
                updated.spaceId.title,
                booking.startDate,
                booking.endDate
            ).catch(err => console.error('Email send failed:', err));
        }

        res.json(updated);
    } catch (err) {
        next(err);
    }
};

module.exports = { createBooking, getUserBookings, getOwnerBookings, updateBookingStatus };
