const express = require("express");
const router = express.Router();
const CollectionsController = require("../controllers/CollectionsController");

/**
 * @swagger
 * /api/collections/create:
 *   post:
 *     summary: Tạo bộ sưu tập mới
 *     tags: [Collections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên bộ sưu tập
 *               description:
 *                 type: string
 *                 description: Mô tả bộ sưu tập
 *               image:
 *                 type: string
 *                 description: URL hình ảnh của bộ sưu tập
 *               backgroundImage:
 *                 type: string
 *                 description: URL hình ảnh nền của bộ sưu tập
 *     responses:
 *       200:
 *         description: Tạo bộ sưu tập thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/create", CollectionsController.createCollection);

/**
 * @swagger
 * /api/collections/get-all:
 *   get:
 *     summary: Lấy tất cả bộ sưu tập
 *     tags: [Collections]
 *     responses:
 *       200:
 *         description: Lấy danh sách bộ sưu tập thành công
 *       500:
 *         description: Lỗi server
 */
router.get("/get-all", CollectionsController.getAllCollections);

/**
 * @swagger
 * /api/collections/get/{id}:
 *   get:
 *     summary: Lấy chi tiết bộ sưu tập
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bộ sưu tập
 *     responses:
 *       200:
 *         description: Lấy chi tiết bộ sưu tập thành công
 *       400:
 *         description: ID bộ sưu tập không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.get("/get/:id", CollectionsController.getCollectionDetail);

/**
 * @swagger
 * /api/collections/update/{id}:
 *   put:
 *     summary: Cập nhật bộ sưu tập
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bộ sưu tập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên bộ sưu tập
 *               description:
 *                 type: string
 *                 description: Mô tả bộ sưu tập
 *               image:
 *                 type: string
 *                 description: URL hình ảnh của bộ sưu tập
 *               backgroundImage:
 *                 type: string
 *                 description: URL hình ảnh nền của bộ sưu tập
 *     responses:
 *       200:
 *         description: Cập nhật bộ sưu tập thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.put("/update/:id", CollectionsController.updateCollection);

/**
 * @swagger
 * /api/collections/delete/{id}:
 *   delete:
 *     summary: Xóa bộ sưu tập
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bộ sưu tập
 *     responses:
 *       200:
 *         description: Xóa bộ sưu tập thành công
 *       400:
 *         description: ID bộ sưu tập không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.delete("/delete/:id", CollectionsController.deleteCollection);

/**
 * @swagger
 * /api/collections/delete-multiple:
 *   post:
 *     summary: Xóa nhiều bộ sưu tập
 *     tags: [Collections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Mảng các ID của bộ sưu tập cần xóa
 *     responses:
 *       200:
 *         description: Xóa các bộ sưu tập thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/delete-multiple", CollectionsController.deleteMultipleCollections);

module.exports = router;