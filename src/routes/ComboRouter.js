const express = require('express');
const router = express.Router();
const comboController = require('../controllers/ComboController');
const { authMiddleWare } = require('../middleware/authMiddleware');
/**
 * @swagger
 * tags:
 *   name: Combo
 *   description: API quản lý Combo sản phẩm
 */
/**
 * @swagger
 * /api/combo/create:
 *   post:
 *     summary: Tạo một combo mới
 *     tags: [Combo]
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
 *               - products
 *               - comboPrice
 *               - mainImage
 *             properties:
 *               name:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               collections:
 *                 type: string
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *               comboPrice:
 *                 type: number
 *               mainImage:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Combo được tạo thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
router.post('/create', comboController.createCombo);

/**
 * @swagger
 * /api/combo/get-all:
 *   get:
 *     summary: Lấy tất cả các combo
 *     tags: [Combo]
 *     responses:
 *       200:
 *         description: Danh sách tất cả các combo
 *       500:
 *         description: Lỗi server
 */
router.get('/get-all', comboController.getAllCombos);

/**
 * @swagger
 * /api/combo/get-all-products:
 *   get:
 *     summary: Lấy tất cả các sản phẩm và combo
 *     tags: [Combo]
 *     responses:
 *       200:
 *         description: Danh sách tất cả các sản phẩm và combo
 *       500:
 *         description: Lỗi server
 */
router.get('/get-all-products', comboController.getAllProducts);

/**
 * @swagger
 * /api/combo/get/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một combo
 *     tags: [Combo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của combo
 *       404:
 *         description: Không tìm thấy combo
 */
router.get('/get/:id', comboController.getComboById);

/**
 * @swagger
 * /api/combo/update/{id}:
 *   put:
 *     summary: Cập nhật thông tin của một combo
 *     tags: [Combo]
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
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               collection:
 *                 type: string
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *               comboPrice:
 *                 type: number
 *               mainImage:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Combo được cập nhật thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy combo
 */
// router.put('/update/:id',  comboController.updateCombo);

/**
 * @swagger
 * /api/combo/delete/{id}:
 *   delete:
 *     summary: Xóa một combo
 *     tags: [Combo]
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
 *         description: Combo được xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy combo
 */
router.delete('/delete/:id',  comboController.deleteCombo);

module.exports = router;