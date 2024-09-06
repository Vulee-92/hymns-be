const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const { authMiddleWare } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API quản lý giỏ hàng
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Cart]
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
 *               quantity:
 *                 type: number
 *                 description: Số lượng sản phẩm
 *     responses:
 *       200:
 *         description: Sản phẩm đã được thêm vào giỏ hàng
 *       401:
 *         description: Không có token, quyền truy cập bị từ chối
 *       500:
 *         description: Lỗi khi thêm sản phẩm vào giỏ hàng
 */
router.post('/add', authMiddleWare, CartController.addToCart);

/**
 * @swagger
 * /api/cart/remove:
 *   delete:
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
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
 *     responses:
 *       200:
 *         description: Sản phẩm đã được xóa khỏi giỏ hàng
 *       401:
 *         description: Không có token, quyền truy cập bị từ chối
 *       500:
 *         description: Lỗi khi xóa sản phẩm khỏi giỏ hàng
 */
router.delete('/remove', authMiddleWare, CartController.removeFromCart);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Cập nhật số lượng sản phẩm trong giỏ hàng
 *     tags: [Cart]
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
 *               quantity:
 *                 type: number
 *                 description: Số lượng sản phẩm
 *     responses:
 *       200:
 *         description: Số lượng sản phẩm đã được cập nhật
 *       401:
 *         description: Không có token, quyền truy cập bị từ chối
 *       500:
 *         description: Lỗi khi cập nhật số lượng sản phẩm
 */
router.put('/update', authMiddleWare, CartController.updateCartItem);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Lấy thông tin giỏ hàng của người dùng
 *     tags: [Cart]
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
 *     responses:
 *       200:
 *         description: Thông tin giỏ hàng của người dùng
 *       401:
 *         description: Không có token, quyền truy cập bị từ chối
 *       500:
 *         description: Lỗi khi lấy thông tin giỏ hàng
 */
router.post('/', authMiddleWare, CartController.getCart);
/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Xóa tất cả sản phẩm trong giỏ hàng
 *     tags: [Cart]
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
 *     responses:
 *       200:
 *         description: Tất cả sản phẩm đã được xóa khỏi giỏ hàng
 *       401:
 *         description: Không có token, quyền truy cập bị từ chối
 *       500:
 *         description: Lỗi khi xóa tất cả sản phẩm khỏi giỏ hàng
 */
router.delete('/clear', authMiddleWare, CartController.clearCart);
module.exports = router;