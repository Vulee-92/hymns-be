const express = require("express");
const router = express.Router();
const CateProductController = require("../controllers/CateProductController");
const { authMiddleWare, checkPermission } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/category-product/create:
 *   post:
 *     summary: Tạo danh mục sản phẩm mới
 *     tags: [CategoryProduct]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: Tên danh mục
 *               image:
 *                 type: string
 *                 description: Hình ảnh của danh mục
 *               slug:
 *                 type: string
 *                 description: Slug của danh mục
 *     responses:
 *       200:
 *         description: Tạo danh mục sản phẩm thành công
 *       500:
 *         description: Lỗi khi tạo danh mục sản phẩm
 */
router.post("/create", CateProductController.createCategory);

/**
 * @swagger
 * /api/category-product/get-all:
 *   get:
 *     summary: Lấy tất cả danh mục sản phẩm
 *     tags: [CategoryProduct]
 *     responses:
 *       200:
 *         description: Lấy danh sách danh mục sản phẩm thành công
 *       500:
 *         description: Lỗi khi lấy danh sách danh mục sản phẩm
 */
router.get("/get-all",authMiddleWare, checkPermission('view'),  CateProductController.getAllCategory);

/**
 * @swagger
 * /api/category-product/get/{id}:
 *   get:
 *     summary: Lấy chi tiết danh mục sản phẩm
 *     tags: [CategoryProduct]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần lấy chi tiết
 *     responses:
 *       200:
 *         description: Lấy chi tiết danh mục sản phẩm thành công
 *       500:
 *         description: Lỗi khi lấy chi tiết danh mục sản phẩm
 */
router.get("/get/:id", CateProductController.getCategoryDetail);

/**
 * @swagger
 * /api/category-product/delete/{id}:
 *   delete:
 *     summary: Xóa danh mục sản phẩm
 *     tags: [CategoryProduct]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần xóa
 *     responses:
 *       200:
 *         description: Xóa danh mục sản phẩm thành công
 *       500:
 *         description: Lỗi khi xóa danh mục sản phẩm
 */
router.delete("/delete/:id", CateProductController.deleteCategory);

/**
 * @swagger
 * /api/category-product/delete-multiple:
 *   delete:
 *     summary: Xóa nhiều danh mục sản phẩm
 *     tags: [CategoryProduct]
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
 *                 description: Mảng các ID của danh mục cần xóa
 *     responses:
 *       200:
 *         description: Xóa nhiều danh mục sản phẩm thành công
 *       500:
 *         description: Lỗi khi xóa nhiều danh mục sản phẩm
 */
router.delete("/delete-multiple", CateProductController.deleteMultipleCategories);

/**
 * @swagger
 * /api/category-product/update/{id}:
 *   put:
 *     summary: Cập nhật danh mục sản phẩm
 *     tags: [CategoryProduct]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: Tên danh mục
 *               image:
 *                 type: string
 *                 description: Hình ảnh của danh mục
 *               slug:
 *                 type: string
 *                 description: Slug của danh mục
 *     responses:
 *       200:
 *         description: Cập nhật danh mục sản phẩm thành công
 *       500:
 *         description: Lỗi khi cập nhật danh mục sản phẩm
 */
router.put("/update/:id", CateProductController.updateCategory);

module.exports = router;