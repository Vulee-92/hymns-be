const express = require('express');
const router = express.Router();
const carrierController = require('../controllers/CarrierController');
const { authUserMiddleWare, authMiddleWare } = require("../middleware/authMiddleware");
/**
 * @swagger
 * tags:
 *   name: Carrier
 *   description: API quản lý nhà vận chuyển
 */
/**
 * @swagger
 * /api/carrier/create:
 *   post:
 *     summary: Tạo một nhà vận chuyển mới
 *     tags: [Carrier]
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
 *               - contactInfo
 *             properties:
 *               name:
 *                 type: string
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *                   address:
 *                     type: object
 *                     properties:
 *                       street:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       postalCode:
 *                         type: string
 *                       country:
 *                         type: string
 *     responses:
 *       200:
 *         description: Nhà vận chuyển được tạo thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
router.post('/create',  carrierController.createCarrier);

/**
 * @swagger
 * /api/carrier/get-all:
 *   get:
 *     summary: Lấy tất cả các nhà vận chuyển
 *     tags: [Carrier]
 *     responses:
 *       200:
 *         description: Danh sách tất cả các nhà vận chuyển
 *       500:
 *         description: Lỗi server
 */
router.get('/get-all', authMiddleWare, carrierController.getAllCarriers);

/**
 * @swagger
 * /api/carrier/get/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một nhà vận chuyển
 *     tags: [Carrier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của nhà vận chuyển
 *       404:
 *         description: Không tìm thấy nhà vận chuyển
 */
router.get('/get/:id', authMiddleWare, carrierController.getCarrierById);

/**
 * @swagger
 * /api/carrier/update/{id}:
 *   put:
 *     summary: Cập nhật thông tin của một nhà vận chuyển
 *     tags: [Carrier]
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
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *                   address:
 *                     type: object
 *                     properties:
 *                       street:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       postalCode:
 *                         type: string
 *                       country:
 *                         type: string
 *     responses:
 *       200:
 *         description: Nhà vận chuyển được cập nhật thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy nhà vận chuyển
 */
router.put('/update/:id', authMiddleWare, carrierController.updateCarrier);

/**
 * @swagger
 * /api/carrier/delete/{id}:
 *   delete:
 *     summary: Xóa một nhà vận chuyển
 *     tags: [Carrier]
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
 *         description: Nhà vận chuyển được xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy nhà vận chuyển
 */
router.delete('/delete/:id', authMiddleWare, carrierController.deleteCarrier);

module.exports = router;