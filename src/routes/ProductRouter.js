const express = require("express");
const router = express.Router();
const ProductController = require("./../controllers/ProductController");
const { authMiddleWare } = require("../middleware/authMiddleware");
/**
 * @swagger
 * /api/product/create:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên sản phẩm
 *               mainImage:
 *                 type: string
 *                 description: Hình ảnh chính của sản phẩm
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách hình ảnh của sản phẩm
 *               countInStock:
 *                 type: number
 *                 description: Số lượng sản phẩm trong kho
 *               price:
 *                 type: number
 *                 description: Giá sản phẩm
 *               rating:
 *                 type: number
 *                 description: Đánh giá sản phẩm
 *               description:
 *                 type: string
 *                 description: Mô tả sản phẩm
 *               discount:
 *                 type: number
 *                 description: Giảm giá sản phẩm
 *               fee:
 *                 type: number
 *                 description: Phí sản phẩm
 *               category:
 *                 type: number
 *                 description: Danh mục sản phẩm
 *               brand:
 *                 type: number
 *                 description: Thương hiệu sản phẩm
 *               collections:
 *                 type: number
 *                 description: Bộ sưu tập sản phẩm
 *     responses:
 *       200:
 *         description: Tạo sản phẩm thành công
 *       500:
 *         description: Lỗi khi tạo sản phẩm
 */
router.post("/create", authMiddleWare, ProductController.createProduct);

/**
 * @swagger
 * /api/product/update/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên sản phẩm
 *               mainImage:
 *                 type: string
 *                 description: Hình ảnh chính của sản phẩm
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách hình ảnh của sản phẩm
 *               countInStock:
 *                 type: number
 *                 description: Số lượng sản phẩm trong kho
 *               price:
 *                 type: number
 *                 description: Giá sản phẩm
 *               rating:
 *                 type: number
 *                 description: Đánh giá sản phẩm
 *               description:
 *                 type: string
 *                 description: Mô tả sản phẩm
 *               discount:
 *                 type: number
 *                 description: Giảm giá sản phẩm
 *               fee:
 *                 type: number
 *                 description: Phí sản phẩm
 *               category:
 *                 type: number
 *                 description: Danh mục sản phẩm
 *               brand:
 *                 type: number
 *                 description: Thương hiệu sản phẩm
 *               collections:
 *                 type: number
 *                 description: Bộ sưu tập sản phẩm
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.put("/update/:id", authMiddleWare, ProductController.updateProduct);
/**
 * @swagger
 * /api/product/p/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết sản phẩm
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Lấy thông tin sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get("/p/:id", ProductController.getDetailsProduct);

/**
 * @swagger
 * /api/product/delete/{id}:
 *   delete:
 *     summary: Xóa sản phẩm
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.delete("/delete/:id", authMiddleWare, ProductController.deleteProduct);


/**
 * @swagger
 * /api/product/delete-many:
 *   post:
 *     summary: Xóa nhiều sản phẩm
 *     tags: [Product]
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
 *                 description: Mảng chứa các ID của sản phẩm cần xóa
 *     responses:
 *       200:
 *         description: Xóa nhiều sản phẩm thành công
 *       500:
 *         description: Lỗi khi xóa nhiều sản phẩm
 */
router.post("/delete-many", ProductController.deleteMany);

/**
 * @swagger
 * /api/product/get-all-brand:
 *   get:
 *     summary: Lấy tất cả thương hiệu sản phẩm
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: selectedTypes
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         required: false
 *         description: Danh sách các loại sản phẩm cần lọc
 *     responses:
 *       200:
 *         description: Lấy danh sách thương hiệu sản phẩm thành công
 *       500:
 *         description: Lỗi khi lấy danh sách thương hiệu sản phẩm
 */
router.get("/get-all-brand", ProductController.getAllBrand);
/**
 * @swagger
 * /api/product/get-all-category:
 *   get:
 *     summary: Lấy tất cả danh mục sản phẩm
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Lấy danh sách danh mục sản phẩm thành công
 *       500:
 *         description: Lỗi khi lấy danh sách danh mục sản phẩm
 */
router.get("/get-all-category", ProductController.getAllCategory);
/**
 * @swagger
 * /api/product/get-all/{collections?}:
 *   get:
 *     summary: Lấy tất cả sản phẩm
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: collections
 *         schema:
 *           type: string
 *         required: false
 *         description: Bộ sưu tập sản phẩm
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Số lượng sản phẩm trên mỗi trang
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Trang hiện tại
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         required: false
 *         description: Sắp xếp sản phẩm
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *         required: false
 *         description: Nhà cung cấp sản phẩm
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Loại sản phẩm
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
 *       500:
 *         description: Lỗi khi lấy danh sách sản phẩm
 */
router.get('/get-all/:collections?', ProductController.getAllProduct);

/**
 * @swagger
 * /api/product/get-all/collections/{brand?}:
 *   get:
 *     summary: Lấy tất cả sản phẩm theo thương hiệu
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: brand
 *         schema:
 *           type: string
 *         required: false
 *         description: Thương hiệu sản phẩm
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Số lượng sản phẩm trên mỗi trang
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Trang hiện tại
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         required: false
 *         description: Sắp xếp sản phẩm
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Loại sản phẩm
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
 *       500:
 *         description: Lỗi khi lấy danh sách sản phẩm
 */
router.get('/get-all/collections/:brand?', ProductController.getAllProductAllowBrand);
/**
 * @swagger
 * /api/product/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         required: true
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Tìm kiếm sản phẩm thành công
 *       500:
 *         description: Lỗi khi tìm kiếm sản phẩm
 */
router.get("/search", ProductController.searchProduct);

module.exports = router;