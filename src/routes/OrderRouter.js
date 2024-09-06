const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const { authUserMiddleWare, authMiddleWare } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/order/create:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *               - shippingMethod
 *               - itemsPrice
 *               - shippingPrice
 *               - totalPrice
 *               - fullName
 *               - address
 *               - city
 *               - province
 *               - ward
 *               - email
 *               - phone
 *             properties:
 *               paymentMethod:
 *                 type: string
 *               shippingMethod:
 *                 type: string
 *               itemsPrice:
 *                 type: number
 *               shippingPrice:
 *                 type: number
 *               totalPrice:
 *                 type: number
 *               fullName:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               province:
 *                 type: string
 *               ward:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/create", OrderController.createOrder);

/**
 * @swagger
 * /api/order/get-all-order/{id}:
 *   get:
 *     summary: Get all orders for a user
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/get-all-order/:id", authUserMiddleWare, OrderController.getAllOrderDetails);

/**
 * @swagger
 * /api/order/get-details-order/{id}:
 *   get:
 *     summary: Get details of a specific order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get("/get-details-order/:id", OrderController.getDetailsOrder);

/**
 * @swagger
 * /api/order/cancel-order/{id}:
 *   delete:
 *     summary: Cancel an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderItems
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.delete("/cancel-order/:id", authUserMiddleWare, OrderController.cancelOrderDetails);

/**
 * @swagger
 * /api/order/update/{id}:
 *   put:
 *     summary: Update an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put("/update/:id", authUserMiddleWare, OrderController.updateOrder);



/**
 * @swagger
 * /api/order/update-all:
 *   post:
 *     summary: Update all orders with slug
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Orders updated successfully
 *       500:
 *         description: Server error
 */
router.post("/update-all", OrderController.updateOrderItemsWithSlug);


/**
 * @swagger
 * /api/order/get-all-order:
 *   get:
 *     summary: Get all orders with pagination
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Page number (default: 1)"
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: "Number of items per page (default: 10)"
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
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
 *       500:
 *         description: Server error
 */
router.get("/get-all-order", OrderController.getAllOrder);

/**
 * @swagger
 * /api/order/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authUserMiddleWare, OrderController.deleteOrder);

/**
 * @swagger
 * /api/order/delete-multiple:
 *   post:
 *     summary: Delete multiple orders
 *     tags: [Order]
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
 *                 description: Array of order IDs to delete
 *     responses:
 *       200:
 *         description: Orders deleted successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/delete-multiple", authUserMiddleWare, OrderController.deleteMultipleOrders);
/**
 * @swagger
 * /api/order/qr-code:
 *   post:
 *     summary: Tạo mã QR cho thanh toán
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID của đơn hàng
 *               amount:
 *                 type: number
 *                 description: Số tiền cần thanh toán
 *     responses:
 *       200:
 *         description: Mã QR được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrCodeData:
 *                   type: string
 *                   description: Dữ liệu mã QR dưới dạng base64
 *       400:
 *         description: Order ID và số tiền là bắt buộc
 *       500:
 *         description: Lỗi khi tạo mã QR
 */
router.post('/qr-code', OrderController.generatePaymentQRCode);
module.exports = router;