const Notification = require('../models/Notification');

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        
        const unreadCount = await Notification.countDocuments({ userId: req.user.id, isRead: false });

        res.json({ notifications, unreadCount });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        if (notification.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();
        res.json(notification);
    } catch (err) {
        next(err);
    }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { isRead: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        next(err);
    }
};

// Helper: Create a notification (used internally by other controllers)
const createNotification = async (userId, message, type = 'general', relatedId = null) => {
    try {
        const notification = new Notification({ userId, message, type, relatedId });
        await notification.save();
        return notification;
    } catch (err) {
        console.error('Failed to create notification:', err);
    }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, createNotification };
