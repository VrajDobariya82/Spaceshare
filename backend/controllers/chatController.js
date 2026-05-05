const Message = require('../models/Message');
const Booking = require('../models/Booking');

// @desc    Get messages for a booking chat room
// @route   GET /api/chat/:bookingId
const getMessages = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate('spaceId', 'ownerId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only the renter or the space owner can view messages
        const isRenter = booking.userId.toString() === req.user.id;
        const isOwner = booking.spaceId.ownerId.toString() === req.user.id;

        if (!isRenter && !isOwner) {
            return res.status(403).json({ message: 'Not authorized to view this chat' });
        }

        const messages = await Message.find({ bookingId: req.params.bookingId })
            .populate('senderId', 'name')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        next(err);
    }
};

// @desc    Send a message in a booking chat
// @route   POST /api/chat
const sendMessage = async (req, res, next) => {
    try {
        const { bookingId, content } = req.body;

        if (!bookingId || !content) {
            return res.status(400).json({ message: 'bookingId and content are required' });
        }

        const booking = await Booking.findById(bookingId)
            .populate('spaceId', 'ownerId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const isRenter = booking.userId.toString() === req.user.id;
        const isOwner = booking.spaceId.ownerId.toString() === req.user.id;

        if (!isRenter && !isOwner) {
            return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
        }

        const message = new Message({
            bookingId,
            senderId: req.user.id,
            content: content.trim()
        });

        const saved = await message.save();
        const populated = await saved.populate('senderId', 'name');

        res.status(201).json(populated);
    } catch (err) {
        next(err);
    }
};

module.exports = { getMessages, sendMessage };
