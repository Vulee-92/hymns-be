const express = require("express");
const router = express.Router();
const BrandProductController = require("../controllers/BrandProductController");

/**
 * @swagger
 * /api/brand-product/create:
 *   post:
 *     summary: Tạo thương hiệu sản phẩm mới
 *     tags: [BrandProduct]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *                 description: Tên thương hiệu
 *               image:
 *                 type: string
 *                 description: Hình ảnh của thương hiệu
 *               slug:
 *                 type: string
 *                 description: Slug của thương hiệu
 *               description:
 *                 type: string
 *                 description: Mô tả bộ sưu tập
 *     responses:
 *       200:
 *         description: Tạo thương hiệu sản phẩm thành công
 *       500:
 *         description: Lỗi khi tạo thương hiệu sản phẩm
 */
router.post("/create", BrandProductController.createBrand);

/**
 * @swagger
 * /api/brand-product/get-all:
 *   get:
 *     summary: Lấy tất cả thương hiệu sản phẩm
 *     tags: [BrandProduct]
 *     responses:
 *       200:
 *         description: Lấy danh sách thương hiệu sản phẩm thành công
 *       500:
 *         description: Lỗi khi lấy danh sách thương hiệu sản phẩm
 */
router.get("/get-all", BrandProductController.getAllBrand);

/**
 * @swagger
 * /api/brand-product/get/{id}:
 *   get:
 *     summary: Lấy chi tiết thương hiệu sản phẩm
 *     tags: [BrandProduct]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thương hiệu cần lấy chi tiết
 *     responses:
 *       200:
 *         description: Lấy chi tiết thương hiệu sản phẩm thành công
 *       500:
 *         description: Lỗi khi lấy chi tiết thương hiệu sản phẩm
 */
router.get("/get/:id", BrandProductController.getBrandDetail);

/**
 * @swagger
 * /api/brand-product/delete/{id}:
 *   delete:
 *     summary: Xóa thương hiệu sản phẩm
 *     tags: [BrandProduct]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thương hiệu cần xóa
 *     responses:
 *       200:
 *         description: Xóa thương hiệu sản phẩm thành công
 *       500:
 *         description: Lỗi khi xóa thương hiệu sản phẩm
 */
router.delete("/delete/:id", BrandProductController.deleteBrand);

/**
 * @swagger
 * /api/brand-product/delete-multiple:
 *   delete:
 *     summary: Xóa nhiều thương hiệu sản phẩm
 *     tags: [BrandProduct]
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
 *                 description: Mảng các ID của thương hiệu cần xóa
 *     responses:
 *       200:
 *         description: Xóa nhiều thương hiệu sản phẩm thành công
 *       500:
 *         description: Lỗi khi xóa nhiều thương hiệu sản phẩm
 */
router.delete("/delete-multiple", BrandProductController.deleteMultipleBrands);

/**
 * @swagger
 * /api/brand-product/update/{id}:
 *   put:
 *     summary: Cập nhật thương hiệu sản phẩm
 *     tags: [BrandProduct]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thương hiệu cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *                 description: Tên thương hiệu
 *               image:
 *                 type: string
 *                 description: Hình ảnh của thương hiệu
 *               slug:
 *                 type: string
 *                 description: Slug của thương hiệu
 *               description:
 *                 type: string
 *                 description: Mô tả bộ sưu tập
 *     responses:
 *       200:
 *         description: Cập nhật thương hiệu sản phẩm thành công
 *       500:
 *         description: Lỗi khi cập nhật thương hiệu sản phẩm
 */
router.put("/update/:id", BrandProductController.updateBrand);

module.exports = router;