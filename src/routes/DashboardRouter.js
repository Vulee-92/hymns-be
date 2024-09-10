const express = require("express");
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');
const { authMiddleWare } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Lấy thông tin tổng quan cho dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Thông tin tổng quan cho dashboard
 *       400:
 *         description: Lỗi khi lấy thông tin
 */
router.get('/summary',  dashboardController.getSummary);

module.exports = router;