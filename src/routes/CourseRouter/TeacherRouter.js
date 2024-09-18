const express = require('express');
const TeacherController = require('../../controllers/CourseController/TeacherController');
const { authMiddleWare, checkPermission } = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Quản lý giáo viên
 */

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Tạo giáo viên mới
 *     tags: [Teachers]
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
 *               teachingSubjects:
 *                 type: array
 *                 items:
 *                   type: string
 *               teachingClasses:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Giáo viên được tạo thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', authMiddleWare, checkPermission('create'), TeacherController.createTeacherController);

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Lấy danh sách tất cả giáo viên
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách giáo viên
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/', authMiddleWare, checkPermission('view'), TeacherController.getAllTeachersController);

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Lấy thông tin giáo viên theo ID
 *     tags: [Teachers]
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
 *         description: Thông tin giáo viên
 *       404:
 *         description: Không tìm thấy giáo viên
 */
router.get('/:id', authMiddleWare, checkPermission('view'), TeacherController.getTeacherByIdController);

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Cập nhật thông tin giáo viên
 *     tags: [Teachers]
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
 *               teachingSubjects:
 *                 type: array
 *                 items:
 *                   type: string
 *               teachingClasses:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Giáo viên được cập nhật thành công
 *       404:
 *         description: Không tìm thấy giáo viên
 */
router.put('/:id', authMiddleWare, checkPermission('edit'), TeacherController.updateTeacherController);

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Xóa mềm giáo viên
 *     tags: [Teachers]
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
 *         description: Giáo viên được xóa mềm thành công
 *       404:
 *         description: Không tìm thấy giáo viên
 */
router.delete('/:id', authMiddleWare, checkPermission('delete'), TeacherController.softDeleteTeacherController);

/**
 * @swagger
 * /teachers/soft-delete:
 *   post:
 *     summary: Xóa mềm nhiều giáo viên
 *     tags: [Teachers]
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
 *         description: Các giáo viên được xóa mềm thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/soft-delete', authMiddleWare, checkPermission('delete'), TeacherController.softDeleteMultipleTeachersController);

module.exports = router;