const Booking = require('../models/Booking');
const Space = require('../models/Space');

// @desc    Process mock payment for a booking
// @route   POST /api/payments/:bookingId
const processPayment = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate('spaceId', 'price title ownerId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only the renter who made the booking can pay
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to pay for this booking' });
        }

        // Must be approved to pay
        if (booking.status !== 'approved') {
            return res.status(400).json({ message: 'Booking must be approved before payment' });
        }

        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({ message: 'Already paid' });
        }

        // Calculate mock amount based on hours * price
        const hours = Math.max(1, Math.ceil(
            (new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60)
        ));
        const amount = hours * booking.spaceId.price;

        // Simulate payment processing (always succeeds)
        booking.paymentStatus = 'paid';
        booking.paymentAmount = amount;
        booking.paidAt = new Date();
        await booking.save();

        const updated = await Booking.findById(booking._id)
            .populate('spaceId', 'title location price type')
            .populate('userId', 'name email');

        res.json({
            message: 'Payment successful!',
            booking: updated,
            paymentDetails: {
                amount,
                hours,
                pricePerHour: booking.spaceId.price,
                paidAt: booking.paidAt
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { processPayment };
