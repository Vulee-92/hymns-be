const express = require("express");
const router = express.Router();
const BlogController = require("../controllers/BlogController");

/**
 * @swagger
 * /api/blog/create:
 *   post:
 *     summary: Tạo blog mới
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề của blog
 *               description:
 *                 type: string
 *                 description: Mô tả của blog
 *               category:
 *                 type: string
 *                 description: Danh mục của blog
 *               image:
 *                 type: string
 *                 description: Hình ảnh của blog
 *     responses:
 *       200:
 *         description: Tạo blog thành công
 *       500:
 *         description: Lỗi khi tạo blog
 */
router.post("/create", BlogController.createBlog);

/**
 * @swagger
 * /api/blog/get-all:
 *   get:
 *     summary: Lấy tất cả blog
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: Lấy danh sách blog thành công
 *       500:
 *         description: Lỗi khi lấy danh sách blog
 */
router.get("/get-all", BlogController.getAllBlogs);

/**
 * @swagger
 * /api/blog/get/{id}:
 *   get:
 *     summary: Lấy chi tiết blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của blog cần lấy chi tiết
 *     responses:
 *       200:
 *         description: Lấy chi tiết blog thành công
 *       500:
 *         description: Lỗi khi lấy chi tiết blog
 */
router.get("/get/:id", BlogController.getBlogDetail);

/**
 * @swagger
 * /api/blog/delete/{id}:
 *   delete:
 *     summary: Xóa blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của blog cần xóa
 *     responses:
 *       200:
 *         description: Xóa blog thành công
 *       500:
 *         description: Lỗi khi xóa blog
 */
router.delete("/delete/:id", BlogController.deleteBlog);

/**
 * @swagger
 * /api/blog/delete-multiple:
 *   post:
 *     summary: Xóa nhiều blog
 *     tags: [Blog]
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
 *                 description: Mảng các ID của blog cần xóa
 *     responses:
 *       200:
 *         description: Xóa nhiều blog thành công
 *       500:
 *         description: Lỗi khi xóa nhiều blog
 */
router.post("/delete-multiple", BlogController.deleteMultipleBlogs);

/**
 * @swagger
 * /api/blog/update/{id}:
 *   put:
 *     summary: Cập nhật blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của blog cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề của blog
 *               description:
 *                 type: string
 *                 description: Mô tả của blog
 *               category:
 *                 type: string
 *                 description: Danh mục của blog
 *               image:
 *                 type: string
 *                 description: Hình ảnh của blog
 *     responses:
 *       200:
 *         description: Cập nhật blog thành công
 *       500:
 *         description: Lỗi khi cập nhật blog
 */
router.put("/update/:id", BlogController.updateBlog);

module.exports = router;