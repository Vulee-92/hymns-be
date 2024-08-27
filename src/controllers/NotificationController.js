const notificationService = require('../services/NotificationService');

const getOrderNotifications = (req, res) => {
    notificationService.streamOrderNotifications(req, res);
  };
  
  module.exports = {
    getOrderNotifications,
  };