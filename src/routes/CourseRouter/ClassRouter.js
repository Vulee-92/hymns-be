const express = require('express');
const ClassController = require('../../controllers/CourseController/ClassController');
const { authMiddleWare, checkPermission } = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Quản lý lớp học
 */

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Tạo lớp học mới
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               title:
 *                 type: string
 *               maxStudents:
 *                 type: number
 *               instructor:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Lớp học được tạo thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', authMiddleWare, checkPermission('create'), ClassController.createClassController);

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Lấy danh sách tất cả lớp học
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách lớp học
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/', authMiddleWare, checkPermission('view'), ClassController.getAllClassesController);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Lấy thông tin lớp học theo ID
 *     tags: [Classes]
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
 *         description: Thông tin lớp học
 *       404:
 *         description: Không tìm thấy lớp học
 */
router.get('/:id', authMiddleWare, checkPermission('view'), ClassController.getClassByIdController);

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Cập nhật thông tin lớp học
 *     tags: [Classes]
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
 *               subject:
 *                 type: string
 *               title:
 *                 type: string
 *               maxStudents:
 *                 type: number
 *               instructor:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Lớp học được cập nhật thành công
 *       404:
 *         description: Không tìm thấy lớp học
 */
router.put('/:id', authMiddleWare, checkPermission('edit'), ClassController.updateClassController);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Xóa mềm lớp học
 *     tags: [Classes]
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
 *         description: Lớp học được xóa mềm thành công
 *       404:
 *         description: Không tìm thấy lớp học
 */
router.delete('/:id', authMiddleWare, checkPermission('delete'), ClassController.softDeleteClassController);

/**
 * @swagger
 * /classes/soft-delete:
 *   post:
 *     summary: Xóa mềm nhiều lớp học
 *     tags: [Classes]
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
 *         description: Các lớp học được xóa mềm thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/soft-delete', authMiddleWare, checkPermission('delete'), ClassController.softDeleteMultipleClassesController);

module.exports = router;