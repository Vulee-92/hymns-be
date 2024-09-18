const express = require('express');
const SubjectController = require('../../controllers/CourseController/SubjectController');
const { authMiddleWare, checkPermission } = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: Quản lý loại môn học
 */

/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Tạo loại môn học mới
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Loại môn học được tạo thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', authMiddleWare, checkPermission('create'), SubjectController.createSubjectController);

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Lấy danh sách tất cả loại môn học
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách loại môn học
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/', authMiddleWare, checkPermission('view'), SubjectController.getAllSubjectsController);

/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Lấy thông tin loại môn học theo ID
 *     tags: [Subjects]
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
 *         description: Thông tin loại môn học
 *       404:
 *         description: Không tìm thấy loại môn học
 */
router.get('/:id', authMiddleWare, checkPermission('view'), SubjectController.getSubjectByIdController);

/**
 * @swagger
 * /subjects/{id}:
 *   put:
 *     summary: Cập nhật thông tin loại môn học
 *     tags: [Subjects]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Loại môn học được cập nhật thành công
 *       404:
 *         description: Không tìm thấy loại môn học
 */
router.put('/:id', authMiddleWare, checkPermission('edit'), SubjectController.updateSubjectController);

/**
 * @swagger
 * /subjects/{id}:
 *   delete:
 *     summary: Xóa mềm loại môn học
 *     tags: [Subjects]
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
 *         description: Loại môn học được xóa mềm thành công
 *       404:
 *         description: Không tìm thấy loại môn học
 */
router.delete('/:id', authMiddleWare, checkPermission('delete'), SubjectController.softDeleteSubjectController);

/**
 * @swagger
 * /subjects/soft-delete:
 *   post:
 *     summary: Xóa mềm nhiều loại môn học
 *     tags: [Subjects]
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
 *         description: Các loại môn học được xóa mềm thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/soft-delete', authMiddleWare, checkPermission('delete'), SubjectController.softDeleteMultipleSubjectsController);

module.exports = router;