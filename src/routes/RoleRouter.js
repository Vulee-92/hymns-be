const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');
const { authMiddleWare, checkPermission } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/role/create:
 *   post:
 *     summary: Tạo vai trò mới
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Admin'
 *               code:
 *                 type: string
 *                 example: 'admin'
 *               permissions:
 *                 type: object
 *                 properties:
 *                   view:
 *                     type: boolean
 *                     example: true
 *                   create:
 *                     type: boolean
 *                     example: true
 *                   edit:
 *                     type: boolean
 *                     example: true
 *                   delete:
 *                     type: boolean
 *                     example: true
 *               isAdmin:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Vai trò được tạo thành công
 *       500:
 *         description: Lỗi khi tạo vai trò
 */
router.post('/create', authMiddleWare, checkPermission('add'),RoleController.createRole);

/**
 * @swagger
 * /api/role/update/{id}:
 *   put:
 *     summary: Cập nhật vai trò theo ID
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vai trò
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Admin'
 *               permissions:
 *                 type: object
 *                 properties:
 *                   view:
 *                     type: boolean
 *                     example: true
 *                   add:
 *                     type: boolean
 *                     example: true
 *                   edit:
 *                     type: boolean
 *                     example: true
 *                   delete:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       200:
 *         description: Vai trò được cập nhật thành công
 *       500:
 *         description: Lỗi khi cập nhật vai trò
 */
router.put('/roles/:id', authMiddleWare, checkPermission('edit'), RoleController.updateRole);

/**
 * @swagger
 * /api/role/delete/{id}:
 *   delete:
 *     summary: Xóa vai trò theo ID
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vai trò
 *     responses:
 *       200:
 *         description: Vai trò được xóa thành công
 *       500:
 *         description: Lỗi khi xóa vai trò
 */
router.delete('/delete/:id', authMiddleWare, checkPermission('delete'), RoleController.deleteRole);

/**
 * @swagger
 * /api/role/get-all:
 *   get:
 *     summary: Lấy tất cả vai trò
 *     tags: [Role]
 *     responses:
 *       200:
 *         description: Lấy tất cả vai trò thành công
 *       500:
 *         description: Lỗi khi lấy tất cả vai trò
 */
router.get('/get-all', authMiddleWare, checkPermission('view'), RoleController.getAllRoles);

/**
 * @swagger
 * /api/role/roles/{id}:
 *   get:
 *     summary: Lấy vai trò theo ID
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vai trò
 *     responses:
 *       200:
 *         description: Lấy vai trò thành công
 *       500:
 *         description: Lỗi khi lấy vai trò
 */
router.get('/roles/:id', authMiddleWare, checkPermission('view'), RoleController.getRoleById);

module.exports = router;
