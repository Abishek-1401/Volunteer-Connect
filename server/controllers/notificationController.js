import Notification from '../models/notificationModel.js';

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .populate('fromUser', 'name profileImage')
      .populate('post', 'content')
      .limit(50);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Create a notification (internal function)
// @access  Private/Internal
const createNotification = async (recipientId, fromUserId, type, message, postId = null, commentId = null) => {
  try {
    // Don't create notification for self-actions
    if (recipientId.toString() === fromUserId.toString()) {
      return null;
    }

    const notification = new Notification({
      recipient: recipientId,
      fromUser: fromUserId,
      type,
      message,
      post: postId,
      comment: commentId,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

export {
  getNotifications,
  markAsRead,
  createNotification,
};
