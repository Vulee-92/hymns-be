const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/RoleController');
const { authMiddleWare, checkPermission } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: API for managing roles
 */

/**
 * @swagger
 * /api/role/create:
 *   post:
 *     summary: Create a new role
 *     tags: [Role]
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
 *                 description: The name of the role
 *               code:
 *                 type: string
 *                 description: The code of the role
 *               permissions:
 *                 type: object
 *                 properties:
 *                   view:
 *                     type: boolean
 *                   create:
 *                     type: boolean
 *                   edit:
 *                     type: boolean
 *                   delete:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Role created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/create', RoleController.createRole);

/**
 * @swagger
 * /api/role/update/{id}:
 *   put:
 *     summary: Update an existing role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the role to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the role
 *               code:
 *                 type: string
 *                 description: The code of the role
 *               permissions:
 *                 type: object
 *                 properties:
 *                   view:
 *                     type: boolean
 *                   create:
 *                     type: boolean
 *                   edit:
 *                     type: boolean
 *                   delete:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.put('/update/:id', authMiddleWare, checkPermission('edit'), RoleController.updateRole);

/**
 * @swagger
 * /api/role/getAll:
 *   get:
 *     summary: Get all roles
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []         # Access token
 *       - refreshTokenAuth: []   # Refresh token
 *     responses:
 *       200:
 *         description: A list of roles
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/getAll', authMiddleWare, checkPermission('view'), RoleController.getAllRoles);

/**
 * @swagger
 * /api/role/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the role to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.get('/:id', authMiddleWare, checkPermission('view'), RoleController.getRoleById);

module.exports = router;