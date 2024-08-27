const express = require('express');
const notificationController = require('../controllers/NotificationController');
const router = express.Router();

router.get('/', notificationController.getOrderNotifications);

module.exports = router;
