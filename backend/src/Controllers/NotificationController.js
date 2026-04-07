const NotificationModel = require('../Models/NotificationModel');

// Get all notifications for a user
const getUserNotifications = async (req, resp) => {
    try {
        const { id } = req.params;
        const notifications = await NotificationModel.find({ receiver: id })
            .populate('sender', 'name email')
            .populate('bug', 'title')
            .populate('project', 'name')
            .sort({ createdAt: -1 });

        resp.json({
            message: "User Notifications Retrieved",
            data: notifications
        });
    } catch (err) {
        resp.status(500).json({
            message: "Error retrieving notifications",
            error: err.message
        });
    }
};

// Mark notification as read
const markAsRead = async (req, resp) => {
    try {
        const { notificationId } = req.params;
        const notification = await NotificationModel.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return resp.status(404).json({
                message: "Notification not found"
            });
        }

        resp.json({
            message: "Notification marked as read",
            data: notification
        });
    } catch (err) {
        resp.status(500).json({
            message: "Error marking notification as read",
            error: err.message
        });
    }
};

// Mark all notifications as read for a user
const markAllAsRead = async (req, resp) => {
    try {
        const { userId } = req.params;
        await NotificationModel.updateMany(
            { receiver: userId, isRead: false },
            { isRead: true }
        );

        resp.json({
            message: "All notifications marked as read"
        });
    } catch (err) {
        resp.status(500).json({
            message: "Error marking notifications as read",
            error: err.message
        });
    }
};

// Get unread notification count for a user
const getUnreadCount = async (req, resp) => {
    try {
        const { userId } = req.params;
        const count = await NotificationModel.countDocuments({
            receiver: userId,
            isRead: false
        });

        resp.json({
            message: "Unread notification count retrieved",
            data: { unreadCount: count }
        });
    } catch (err) {
        resp.status(500).json({
            message: "Error getting unread count",
            error: err.message
        });
    }
};

module.exports = {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
};