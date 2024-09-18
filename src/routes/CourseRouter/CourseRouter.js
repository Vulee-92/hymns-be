const express = require('express');
const CourseController = require('../../controllers/CourseController/CourseController');
const { authMiddleWare, checkPermission } = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Quản lý khoá học
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Tạo khoá học mới
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               instructor:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Khoá học được tạo thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', authMiddleWare, checkPermission('create'), CourseController.createCourseController);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Lấy danh sách tất cả khoá học
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách khoá học
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/', authMiddleWare, checkPermission('view'), CourseController.getAllCoursesController);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Lấy thông tin khoá học theo ID
 *     tags: [Courses]
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
 *         description: Thông tin khoá học
 *       404:
 *         description: Không tìm thấy khoá học
 */
router.get('/:id', authMiddleWare, checkPermission('view'), CourseController.getCourseByIdController);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Cập nhật thông tin khoá học
 *     tags: [Courses]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               instructor:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Khoá học được cập nhật thành công
 *       404:
 *         description: Không tìm thấy khoá học
 */
router.put('/:id', authMiddleWare, checkPermission('edit'), CourseController.updateCourseController);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Xóa mềm khoá học
 *     tags: [Courses]
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
 *         description: Khoá học được xóa mềm thành công
 *       404:
 *         description: Không tìm thấy khoá học
 */
router.delete('/:id', authMiddleWare, checkPermission('delete'), CourseController.softDeleteCourseController);

/**
 * @swagger
 * /courses/soft-delete:
 *   post:
 *     summary: Xóa mềm nhiều khoá học
 *     tags: [Courses]
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
 *         description: Các khoá học được xóa mềm thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/soft-delete', authMiddleWare, checkPermission('delete'), CourseController.softDeleteMultipleCoursesController);

module.exports = router;    