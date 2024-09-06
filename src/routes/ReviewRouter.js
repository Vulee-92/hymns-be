const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');
const { authMiddleWare } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API quản lý đánh giá
 */

/**
 * @swagger
 * /api/reviews/add:
 *   post:
 *     summary: Thêm đánh giá cho sản phẩm
 *     tags: [Reviews]
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
 *               productId:
 *                 type: string
 *                 description: ID của sản phẩm
 *               rating:
 *                 type: number
 *                 description: Đánh giá (1-5)
 *               comment:
 *                 type: string
 *                 description: Bình luận
 *     responses:
 *       200:
 *         description: Đánh giá đã được thêm
 *       401:
 *         description: Không có token, quyền truy cập bị từ chối
 *       500:
 *         description: Lỗi khi thêm đánh giá
 */
router.post('/add',  ReviewController.addReview);

/**
 * @swagger
 * /api/reviews/delete:
 *   delete:
 *     summary: Xóa đánh giá
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewId:
 *                 type: string
 *                 description: ID của đánh giá
 *     responses:
 *       200:
 *         description: Đánh giá đã được xóa
 *       401:
 *         description: Không có token, quyền truy cập bị từ chối
 *       500:
 *         description: Lỗi khi xóa đánh giá
 */
router.delete('/delete', authMiddleWare, ReviewController.deleteReview);

/**
 * @swagger
 * /api/reviews/update:
 *   put:
 *     summary: Cập nhật đánh giá
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewId:
 *                 type: string
 *                 description: ID của đánh giá
 *               rating:
 *                 type: number
 *                 description: Đánh giá (1-5)
 *               comment:
 *                 type: string
 *                 description: Bình luận
 *     responses:
 *       200:
 *         description: Đánh giá đã được cập nhật
 *       401:
 *         description: Không có token, quyền truy cập bị từ chối
 *       500:
 *         description: Lỗi khi cập nhật đánh giá
 */
router.put('/update', authMiddleWare, ReviewController.updateReview);

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Lấy danh sách đánh giá của sản phẩm
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Danh sách đánh giá của sản phẩm
 *       401:
 *         description: Không có token, quyền truy cập bị từ chối
 *       500:
 *         description: Lỗi khi lấy danh sách đánh giá
 */
router.get('/', authMiddleWare, ReviewController.getReviewsByProduct);

module.exports = router;