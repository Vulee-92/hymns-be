const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');
const { authMiddleware, checkPermission, adminMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/role/create:
 *   post:
 *     summary: Tạo vai trò mới
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *       - refreshTokenAuth: []
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
 *               description:
 *                 type: string
 *                 example: 'Administrator role'
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     resource:
 *                       type: string
 *                       example: 'users'
 *                     actions:
 *                       type: object
 *                       properties:
 *                         create:
 *                           type: boolean
 *                           example: true
 *                         read:
 *                           type: boolean
 *                           example: true
 *                         update:
 *                           type: boolean
 *                           example: true
 *                         delete:
 *                           type: boolean
 *                           example: true
 *     responses:
 *       201:
 *         description: Vai trò được tạo thành công
 *       403:
 *         description: Không có quyền tạo vai trò
 *       500:
 *         description: Lỗi khi tạo vai trò
 */
router.post('/create', authMiddleware, checkPermission('all', 'create'), RoleController.createRole);

/**
 * @swagger
 * /api/role/{id}:
 *   put:
 *     summary: Cập nhật vai trò theo ID
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
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
 *                 example: 'Updated Admin'
 *               description:
 *                 type: string
 *                 example: 'Updated Administrator role'
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     resource:
 *                       type: string
 *                       example: 'users'
 *                     actions:
 *                       type: object
 *                       properties:
 *                         create:
 *                           type: boolean
 *                           example: true
 *                         read:
 *                           type: boolean
 *                           example: true
 *                         update:
 *                           type: boolean
 *                           example: true
 *                         delete:
 *                           type: boolean
 *                           example: true
 *     responses:
 *       200:
 *         description: Vai trò được cập nhật thành công
 *       403:
 *         description: Không có quyền cập nhật vai trò
 *       404:
 *         description: Không tìm thấy vai trò
 *       500:
 *         description: Lỗi khi cập nhật vai trò
 */
router.put('/:id', authMiddleware, checkPermission('roles', 'update'), RoleController.updateRole);

/**
 * @swagger
 * /api/role/{id}:
 *   delete:
 *     summary: Xóa vai trò theo ID
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
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
 *       403:
 *         description: Không có quyền xóa vai trò
 *       404:
 *         description: Không tìm thấy vai trò
 *       500:
 *         description: Lỗi khi xóa vai trò
 */
router.delete('/:id', authMiddleware, checkPermission('roles', 'delete'), RoleController.deleteRole);

/**
 * @swagger
 * /api/role:
 *   get:
 *     summary: Lấy tất cả vai trò
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *       - refreshTokenAuth: []
 *     responses:
 *       200:
 *         description: Lấy tất cả vai trò thành công
 *       403:
 *         description: Không có quyền xem vai trò
 *       500:
 *         description: Lỗi khi lấy tất cả vai trò
 */
router.get('/', authMiddleware, checkPermission('all', 'read'), RoleController.getAllRoles);

/**
 * @swagger
 * /api/role/{id}:
 *   get:
 *     summary: Lấy vai trò theo ID
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
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
 *       403:
 *         description: Không có quyền xem vai trò
 *       404:
 *         description: Không tìm thấy vai trò
 *       500:
 *         description: Lỗi khi lấy vai trò
 */
router.get('/:id', authMiddleware, checkPermission('roles', 'read'), RoleController.getRoleById);

module.exports = router;