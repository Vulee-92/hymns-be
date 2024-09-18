const express = require('express');
const AttendanceController = require('../controllers/AttendanceController');
const { authMiddleWare, checkPermission } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Quản lý điểm danh
 */

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Điểm danh học viên
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *               classId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Điểm danh thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', authMiddleWare, checkPermission('create'), AttendanceController.markAttendanceController);

/**
 * @swagger
 * /attendance/rollback:
 *   post:
 *     summary: Rollback điểm danh học viên
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *               classId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Rollback điểm danh thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/rollback', authMiddleWare, checkPermission('edit'), AttendanceController.rollbackAttendanceController);

module.exports = router;