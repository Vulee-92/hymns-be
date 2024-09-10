const express = require("express");
const router = express.Router();
const ProductController = require("./../controllers/ProductController");
const { authMiddleWare } = require("../middleware/authMiddleware");
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         mainImage:
 *           type: string
 *         image:
 *           type: array
 *           items:
 *             type: string
 *         countInStock:
 *           type: number
 *         rating:
 *           type: number
 *         discount:
 *           type: number
 *         fee:
 *           type: number
 *         brand:
 *           $ref: '#/components/schemas/Brand'
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         collections:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Collection'
 *     Brand:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *     Collection:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 */
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
 *                 type: string
 *                 description: Danh mục sản phẩm (ObjectId)
 *               brand:
 *                 type: string
 *                 description: Thương hiệu sản phẩm (ObjectId)
 *               collections:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Bộ sưu tập sản phẩm (ObjectId)
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
 *                 type: string
 *                 description: Danh mục sản phẩm (ObjectId)
 *               brand:
 *                 type: string
 *                 description: Thương hiệu sản phẩm (ObjectId)
 *               collections:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Bộ sưu tập sản phẩm (ObjectId)
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.put("/update/:id",  ProductController.updateProduct);

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
router.post("/delete-many", authMiddleWare, ProductController.deleteManyProduct);

/**
 * @swagger
 * /api/product/get-all:
 *   get:
 *     summary: Lấy tất cả sản phẩm với các tùy chọn lọc và sắp xếp
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: collection_slug
 *         schema:
 *           type: string
 *         description: Slug của bộ sưu tập
 *       - in: query
 *         name: brand_slug
 *         schema:
 *           type: string
 *         description: Slug của thương hiệu
 *       - in: query
 *         name: category_slug
 *         schema:
 *           type: string
 *         description: Slug của danh mục
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, newest, oldest, best_selling]
 *         description: Tùy chọn sắp xếp
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang (mặc định là 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Số sản phẩm trên mỗi trang (mặc định là 10)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: false
 *         description: Từ khóa tìm kiếm sản phẩm
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
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
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                 brands:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Lỗi khi lấy danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERR
 *                 message:
 *                   type: string
 */
router.get('/get-all', ProductController.getAllProduct);

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

/**
 * @swagger
 * /api/product/notify-when-available:
 *   post:
 *     summary: Đăng ký nhận thông báo khi sản phẩm có hàng trở lại
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *               productId:
 *                 type: string
 *                 description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       400:
 *         description: Lỗi khi đăng ký
 */
router.post('/notify-when-available', ProductController.registerNotification);

/**
 * @swagger
 * /api/product/update-all-brands:
 *   put:
 *     summary: Cập nhật tất cả sản phẩm chuyển đổi brand từ Number sang ObjectId
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả sản phẩm thành công
 *       500:
 *         description: Lỗi khi cập nhật tất cả sản phẩm
 */
router.put('/update-all-brands', ProductController.updateAllProductsBrand);

module.exports = router;