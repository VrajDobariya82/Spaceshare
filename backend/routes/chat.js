const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getMessages, sendMessage } = require('../controllers/chatController');

// @route  GET /api/chat/:bookingId
// @desc   Get messages for a booking chat
router.get('/:bookingId', auth, getMessages);

// @route  POST /api/chat
// @desc   Send a message
router.post('/', auth, sendMessage);

module.exports = router;
