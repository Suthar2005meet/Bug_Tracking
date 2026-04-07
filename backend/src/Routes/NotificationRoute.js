const router = require('express').Router()

const NotificationController = require('../Controllers/NotificationController')
const validateToken = require('../middlewares/authMiddleware')

// Get all notifications for a user
router.get('/all/:id',  NotificationController.getUserNotifications)

// Mark a specific notification as read
router.put('/:notificationId/read', NotificationController.markAsRead)

// Mark all notifications as read for a user
router.put('/user/:userId/read-all',  NotificationController.markAllAsRead)

// Get unread notification count for a user
router.get('/user/:userId/unread-count',  NotificationController.getUnreadCount)

module.exports = router