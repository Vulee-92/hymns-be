const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/PaymentMethodController');
const { authMiddleWare } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/payment-method/create:
 *   post:
 *     summary: Tạo một phương thức thanh toán mới
 *     tags: [PaymentMethod]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [counter, cod, bank_transfer]
 *               bankDetails:
 *                 type: object
 *                 properties:
 *                   bankName:
 *                     type: string
 *                   accountNumber:
 *                     type: string
 *                   accountHolderName:
 *                     type: string
 *     responses:
 *       200:
 *         description: Phương thức thanh toán được tạo thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
router.post('/create', paymentMethodController.createPaymentMethod);

/**
 * @swagger
 * /api/payment-method:
 *   get:
 *     summary: Lấy danh sách tất cả các phương thức thanh toán
 *     tags: [PaymentMethod]
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/', paymentMethodController.getAllPaymentMethods);

/**
 * @swagger
 * /api/payment-method/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một phương thức thanh toán
 *     tags: [PaymentMethod]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy phương thức thanh toán
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/:id', paymentMethodController.getPaymentMethodById);

/**
 * @swagger
 * /api/payment-method/update/{id}:
 *   put:
 *     summary: Cập nhật thông tin của một phương thức thanh toán
 *     tags: [PaymentMethod]
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
 *               type:
 *                 type: string
 *                 enum: [counter, cod, bank_transfer]
 *               bankDetails:
 *                 type: object
 *                 properties:
 *                   bankName:
 *                     type: string
 *                   accountNumber:
 *                     type: string
 *                   accountHolderName:
 *                     type: string
 *     responses:
 *       200:
 *         description: Phương thức thanh toán được cập nhật thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Không tìm thấy phương thức thanh toán
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/update/:id', authMiddleWare, paymentMethodController.updatePaymentMethod);

/**
 * @swagger
 * /api/payment-method/delete/{id}:
 *   delete:
 *     summary: Xóa một phương thức thanh toán
 *     tags: [PaymentMethod]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Phương thức thanh toán được xóa thành công
 *       404:
 *         description: Không tìm thấy phương thức thanh toán
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/delete/:id', authMiddleWare, paymentMethodController.deletePaymentMethod);

module.exports = router;