const express = require("express");
const router = express.Router();
const BlogCateController = require("../controllers/BlogCateController");
/**
 * @swagger
 * tags:
 *   name: BlogCategory
 *   description: API quản lý loại bài viết
 */

/**
 * @swagger
 * /api/blog-category/create:
 *   post:
 *     summary: Tạo danh mục blog mới
 *     tags: [BlogCategory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề của danh mục
 *               description:
 *                 type: string
 *                 description: Mô tả của danh mục
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/create", BlogCateController.createCate);

/**
 * @swagger
 * /api/blog-category/get-all:
 *   get:
 *     summary: Lấy tất cả danh mục blog
 *     tags: [BlogCategory]
 *     responses:
 *       200:
 *         description: Lấy danh sách danh mục thành công
 *       500:
 *         description: Lỗi server
 */
router.get("/get-all", BlogCateController.getAllCates);

/**
 * @swagger
 * /api/blog-category/{id}:
 *   get:
 *     summary: Lấy chi tiết danh mục blog
 *     tags: [BlogCategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Lấy chi tiết danh mục thành công
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", BlogCateController.getCateById);

/**
 * @swagger
 * /api/blog-category/{id}:
 *   put:
 *     summary: Cập nhật danh mục blog
 *     tags: [BlogCategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề mới của danh mục
 *               description:
 *                 type: string
 *                 description: Mô tả mới của danh mục
 *     responses:
 *       200:
 *         description: Cập nhật danh mục thành công
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", BlogCateController.updateCate);

/**
 * @swagger
 * /api/blog-category/{id}:
 *   delete:
 *     summary: Xóa danh mục blog
 *     tags: [BlogCategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", BlogCateController.deleteCate);

/**
 * @swagger
 * /api/blog-category/delete-multiple:
 *   post:
 *     summary: Xóa nhiều danh mục blog
 *     tags: [BlogCategory]
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
 *                 description: Mảng các ID của danh mục cần xóa
 *     responses:
 *       200:
 *         description: Xóa các danh mục thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/delete-multiple", BlogCateController.deleteMultipleCates);

module.exports = router;