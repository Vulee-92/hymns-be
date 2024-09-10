const express = require("express");
const router = express.Router();
const CollectionsController = require("../controllers/CollectionsController");

/**
 * @swagger
 * /api/collection/create:
 *   post:
 *     summary: Tạo bộ sưu tập mới
 *     tags: [Collection]
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
 *                 description: Hình ảnh của bộ sưu tập
 *               backgroundImage:
 *                 type: string
 *                 description: Hình nền của bộ sưu tập
 *               slug:
 *                 type: string
 *                 description: Slug của bộ sưu tập
 *     responses:
 *       200:
 *         description: Tạo bộ sưu tập thành công
 *       500:
 *         description: Lỗi khi tạo bộ sưu tập
 */
router.post("/create", CollectionsController.createCollection);

/**
 * @swagger
 * /api/collection/get-all:
 *   get:
 *     summary: Lấy tất cả bộ sưu tập
 *     tags: [Collection]
 *     responses:
 *       200:
 *         description: Lấy danh sách bộ sưu tập thành công
 *       500:
 *         description: Lỗi khi lấy danh sách bộ sưu tập
 */
router.get("/get-all", CollectionsController.getAllCollections);

/**
 * @swagger
 * /api/collection/get/{id}:
 *   get:
 *     summary: Lấy chi tiết bộ sưu tập
 *     tags: [Collection]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bộ sưu tập cần lấy chi tiết
 *     responses:
 *       200:
 *         description: Lấy chi tiết bộ sưu tập thành công
 *       500:
 *         description: Lỗi khi lấy chi tiết bộ sưu tập
 */
router.get("/get/:id", CollectionsController.getCollectionDetail);

/**
 * @swagger
 * /api/collection/delete/{id}:
 *   delete:
 *     summary: Xóa bộ sưu tập
 *     tags: [Collection]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bộ sưu tập cần xóa
 *     responses:
 *       200:
 *         description: Xóa bộ sưu tập thành công
 *       500:
 *         description: Lỗi khi xóa bộ sưu tập
 */
router.delete("/delete/:id", CollectionsController.deleteCollection);

/**
 * @swagger
 * /api/collection/delete-multiple:
 *   delete:
 *     summary: Xóa nhiều bộ sưu tập
 *     tags: [Collection]
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
 *                 description: Mảng các ID của bộ sưu tập cần xóa
 *     responses:
 *       200:
 *         description: Xóa nhiều bộ sưu tập thành công
 *       500:
 *         description: Lỗi khi xóa nhiều bộ sưu tập
 */
router.delete("/delete-multiple", CollectionsController.deleteMultipleCollections);

/**
 * @swagger
 * /api/collection/update/{id}:
 *   put:
 *     summary: Cập nhật bộ sưu tập
 *     tags: [Collection]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bộ sưu tập cần cập nhật
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
 *                 description: Hình ảnh của bộ sưu tập
 *               backgroundImage:
 *                 type: string
 *                 description: Hình nền của bộ sưu tập
 *               slug:
 *                 type: string
 *                 description: Slug của bộ sưu tập
 *     responses:
 *       200:
 *         description: Cập nhật bộ sưu tập thành công
 *       500:
 *         description: Lỗi khi cập nhật bộ sưu tập
 */
router.put("/update/:id", CollectionsController.updateCollection);

module.exports = router;