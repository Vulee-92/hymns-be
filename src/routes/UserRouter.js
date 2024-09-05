const express = require("express");
const router = express.Router();
const userController = require('../controllers/UserController');
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/user/sign-up:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên người dùng
 *               email:
 *                 type: string
 *                 description: Email người dùng
 *               password:
 *                 type: string
 *                 description: Mật khẩu người dùng
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       400:
 *         description: Lỗi khi đăng ký
 */
router.post('/sign-up', userController.createUser);

/**
 * @swagger
 * /api/user/sign-in:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 */
router.post('/sign-in', userController.loginUser);

/**
 * @swagger
 * /api/user/log-out:
 *   post:
 *     summary: Đăng xuất người dùng
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       400:
 *         description: Lỗi khi đăng xuất
 */
router.post('/log-out', userController.logoutUser);

/**
 * @swagger
 * /api/user/update-user/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên người dùng
 *               email:
 *                 type: string
 *                 description: Email người dùng
 *               password:
 *                 type: string
 *                 description: Mật khẩu người dùng
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi khi cập nhật
 */
router.put('/update-user/:id', authUserMiddleWare, userController.updateUser);

/**
 * @swagger
 * /api/user/delete-user/{id}:
 *   delete:
 *     summary: Xóa người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       400:
 *         description: Lỗi khi xóa
 */
router.delete('/delete-user/:id', authMiddleWare, userController.deleteUser);

/**
 * @swagger
 * /api/user/getAll:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *       400:
 *         description: Lỗi khi lấy danh sách
 */
router.get('/getAll',  userController.getAllUser);

/**
 * @swagger
 * /api/user/get-details/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *       400:
 *         description: Lỗi khi lấy thông tin
 */
router.get('/get-details/:id', authUserMiddleWare, userController.getDetailsUser);

/**
 * @swagger
 * /api/user/refresh-token:
 *   post:
 *     summary: Làm mới token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token cần làm mới
 *     responses:
 *       200:
 *         description: Làm mới token thành công
 *       400:
 *         description: Lỗi khi làm mới token
 */
router.post('/refresh-token', userController.refreshToken);

/**
 * @swagger
 * /api/user/delete-many:
 *   post:
 *     summary: Xóa nhiều người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *                 description: Danh sách ID của người dùng cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       400:
 *         description: Lỗi khi xóa
 */
router.post('/delete-many', authMiddleWare, userController.deleteMany);

/**
 * @swagger
 * /api/user/verify/{id}/{verificationCode}:
 *   get:
 *     summary: Xác minh người dùng
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của người dùng
 *       - in: path
 *         name: verificationCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Mã xác minh
 *     responses:
 *       200:
 *         description: Xác minh thành công
 *       400:
 *         description: Lỗi khi xác minh
 */
router.get('/verify/:id/:verificationCode', userController.verifyUser);

/**
 * @swagger
 * /api/user/forgot-password:
 *   post:
 *     summary: Quên mật khẩu
 *     tags: [User]
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
 *     responses:
 *       200:
 *         description: Gửi email quên mật khẩu thành công
 *       400:
 *         description: Lỗi khi gửi email quên mật khẩu
 */
router.post('/forgot-password', userController.forgotPassword);

/**
 * @swagger
 * /api/user/reset-password/{id}/{tokenReset}:
 *   post:
 *     summary: Đặt lại mật khẩu
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của người dùng
 *       - in: path
 *         name: tokenReset
 *         schema:
 *           type: string
 *         required: true
 *         description: Token đặt lại mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Mật khẩu mới
 *               confirmPassword:
 *                 type: string
 *                 description: Xác nhận mật khẩu mới
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *       400:
 *         description: Lỗi khi đặt lại mật khẩu
 */
router.post('/reset-password/:id/:tokenReset', userController.resetPassword);

module.exports = router;