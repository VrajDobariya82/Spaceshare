const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');

// @route  GET /api/notifications
// @desc   Get notifications for the logged-in user
router.get('/', auth, getNotifications);

// @route  PATCH /api/notifications/read-all
// @desc   Mark all notifications as read
router.patch('/read-all', auth, markAllAsRead);

// @route  PATCH /api/notifications/:id/read
// @desc   Mark a single notification as read
router.patch('/:id/read', auth, markAsRead);

module.exports = router;
