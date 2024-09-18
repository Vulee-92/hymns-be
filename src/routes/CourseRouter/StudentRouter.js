const express = require('express');
const StudentController = require('../controllers/StudentController');
const { authMiddleWare, checkPermission } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Quản lý học viên
 */

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Tạo học viên mới
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               enrolledClasses:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Học viên được tạo thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', authMiddleWare, checkPermission('create'), StudentController.createStudentController);

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Lấy danh sách tất cả học viên
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách học viên
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/', authMiddleWare, checkPermission('view'), StudentController.getAllStudentsController);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Lấy thông tin học viên theo ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin học viên
 *       404:
 *         description: Không tìm thấy học viên
 */
router.get('/:id', authMiddleWare, checkPermission('view'), StudentController.getStudentByIdController);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Cập nhật thông tin học viên
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               enrolledClasses:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Học viên được cập nhật thành công
 *       404:
 *         description: Không tìm thấy học viên
 */
router.put('/:id', authMiddleWare, checkPermission('edit'), StudentController.updateStudentController);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Xóa mềm học viên
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Học viên được xóa mềm thành công
 *       404:
 *         description: Không tìm thấy học viên
 */
router.delete('/:id', authMiddleWare, checkPermission('delete'), StudentController.softDeleteStudentController);

/**
 * @swagger
 * /students/soft-delete:
 *   post:
 *     summary: Xóa mềm nhiều học viên
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Các học viên được xóa mềm thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/soft-delete', authMiddleWare, checkPermission('delete'), StudentController.softDeleteMultipleStudentsController);

module.exports = router;