const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/ShippingController');
const { authMiddleWare } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/shipping/create:
 *   post:
 *     summary: Tạo một vận chuyển mới
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - trackingNumber
 *               - carrier
 *               - status
 *               - shippingAddress
 *             properties:
 *               orderId:
 *                 type: string
 *               trackingNumber:
 *                 type: string
 *               carrier:
 *                 type: string
 *               status:
 *                 type: string
 *               estimatedDeliveryDate:
 *                 type: string
 *                 format: date
 *               actualDeliveryDate:
 *                 type: string
 *                 format: date
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       200:
 *         description: Vận chuyển được tạo thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
router.post('/create', authMiddleWare, shippingController.createShipping);

/**
 * @swagger
 * /api/shipping/get-all:
 *   get:
 *     summary: Lấy tất cả các vận chuyển
 *     tags: [Shipping]
 *     responses:
 *       200:
 *         description: Danh sách tất cả các vận chuyển
 *       500:
 *         description: Lỗi server
 */
router.get('/get-all', authMiddleWare, shippingController.getAllShippings);

/**
 * @swagger
 * /api/shipping/get/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một vận chuyển
 *     tags: [Shipping]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của vận chuyển
 *       404:
 *         description: Không tìm thấy vận chuyển
 */
router.get('/get/:id', authMiddleWare, shippingController.getShippingById);

/**
 * @swagger
 * /api/shipping/update/{id}:
 *   put:
 *     summary: Cập nhật thông tin của một vận chuyển
 *     tags: [Shipping]
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
 *               trackingNumber:
 *                 type: string
 *               carrier:
 *                 type: string
 *               status:
 *                 type: string
 *               estimatedDeliveryDate:
 *                 type: string
 *                 format: date
 *               actualDeliveryDate:
 *                 type: string
 *                 format: date
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       200:
 *         description: Vận chuyển được cập nhật thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy vận chuyển
 */
router.put('/update/:id', authMiddleWare, shippingController.updateShipping);

/**
 * @swagger
 * /api/shipping/delete/{id}:
 *   delete:
 *     summary: Xóa một vận chuyển
 *     tags: [Shipping]
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
 *         description: Vận chuyển được xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy vận chuyển
 */
router.delete('/delete/:id', authMiddleWare, shippingController.deleteShipping);

module.exports = router;