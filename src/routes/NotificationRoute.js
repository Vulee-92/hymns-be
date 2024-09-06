const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const { authMiddleWare } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API quản lý thông báo
 */

/**
 * @swagger
 * /api/notifications/user:
 *   post:
 *     summary: Lấy danh sách thông báo của người dùng
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người dùng
 *                 required: true
 *     responses:
 *       200:
 *         description: Danh sách thông báo của người dùng
 *       401:
 *         description: Không có token, quyền truy cập bị từ chối
 *       500:
 *         description: Lỗi khi lấy danh sách thông báo
 */
router.post('/user', NotificationController.getNotificationsByUser);

/**
 * @swagger
 * /api/notifications/mark-as-read:
 *   post:
 *     summary: Đánh dấu thông báo là đã đọc
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationId:
 *                 type: string
 *                 description: ID của thông báo
 *     responses:
 *       200:
 *         description: Thông báo đã được đánh dấu là đã đọc
 *       401:
 *         description: Không có token, quyền truy cập bị từ chối
 *       500:
 *         description: Lỗi khi đánh dấu thông báo là đã đọc
 */
router.post('/mark-as-read',  NotificationController.markNotificationAsRead);

module.exports = router;