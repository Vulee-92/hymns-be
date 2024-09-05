const express = require('express');
const router = express.Router();
const { uploadImageController, deleteImageController, listImagesController } = require('../controllers/CloudinaryController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Cấu hình multer để lưu trữ file tạm thời



/**
 * @swagger
 * /api/image/upload:
 *   post:
 *     summary: Tải lên hình ảnh
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Các tệp hình ảnh để tải lên
 *     responses:
 *       200:
 *         description: Hình ảnh đã được tải lên thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Hình ảnh đã được tải lên thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                         description: URL của hình ảnh
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/image/delete/{publicId}:
 *   delete:
 *     summary: Xóa hình ảnh
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: Public ID của hình ảnh cần xóa
 *     responses:
 *       200:
 *         description: Hình ảnh đã được xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Hình ảnh đã được xóa thành công
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/image/list:
 *   get:
 *     summary: Lấy danh sách tất cả hình ảnh
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: Danh sách hình ảnh
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                     description: URL của hình ảnh
 *                   public_id:
 *                     type: string
 *                     description: Public ID của hình ảnh
 *       500:
 *         description: Lỗi máy chủ
 */

router.post('/upload', upload.array('images', 10), uploadImageController); // Chấp nhận tối đa 10 file
router.delete('/delete/:publicId', deleteImageController);
router.get('/list', listImagesController);

module.exports = router;