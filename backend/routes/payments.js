const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { processPayment } = require('../controllers/paymentController');

// @route  POST /api/payments/:bookingId
// @desc   Process mock payment for a booking
router.post('/:bookingId', auth, processPayment);

module.exports = router;
