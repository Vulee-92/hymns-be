const NotificationService = require('../services/NotificationService');

const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("userId", userId);
    const notifications = await NotificationService.getNotificationsByUser(userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const notification = await NotificationService.markNotificationAsRead(notificationId);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotificationsByUser,
  markNotificationAsRead,
};