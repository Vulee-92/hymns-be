const express = require('express');
const router = express.Router();
const FeatureController = require('../controllers/FeatureController');
const { authMiddleWare, checkPermission } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Feature
 *   description: API for managing features
 */

/**
 * @swagger
 * /api/feature/create:
 *   post:
 *     summary: Create a new feature
 *     tags: [Feature]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameMenu:
 *                 type: string
 *               icon:
 *                 type: string
 *               order:
 *                 type: number
 *               subId:
 *                 type: string
 *               parentId:
 *                 type: string
 *               url:
 *                 type: string
 *               stt:
 *                 type: string
 *               permission:
 *                 type: object
 *                 properties:
 *                   add:
 *                     type: boolean
 *                   view:
 *                     type: boolean
 *                   edit:
 *                     type: boolean
 *                   delete:
 *                     type: boolean
 *                   export:
 *                     type: boolean
 *                   print:
 *                     type: boolean
 *     responses:
 *       201:
 *         description: Feature created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/create', authMiddleWare, checkPermission('features', 'add'), FeatureController.createFeature);

/**
 * @swagger
 * /api/feature/update/{id}:
 *   put:
 *     summary: Update an existing feature
 *     tags: [Feature]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameMenu:
 *                 type: string
 *               icon:
 *                 type: string
 *               order:
 *                 type: number
 *               subId:
 *                 type: string
 *               parentId:
 *                 type: string
 *               url:
 *                 type: string
 *               stt:
 *                 type: string
 *               permission:
 *                 type: object
 *                 properties:
 *                   add:
 *                     type: boolean
 *                   view:
 *                     type: boolean
 *                   edit:
 *                     type: boolean
 *                   delete:
 *                     type: boolean
 *                   export:
 *                     type: boolean
 *                   print:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Feature updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Feature not found
 */
router.put('/update/:id', authMiddleWare, checkPermission('features', 'edit'), FeatureController.updateFeature);

/**
 * @swagger
 * /api/feature/delete/{id}:
 *   delete:
 *     summary: Delete a feature
 *     tags: [Feature]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feature deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Feature not found
 */
router.delete('/delete/:id', authMiddleWare, checkPermission('features', 'delete'), FeatureController.deleteFeature);

/**
 * @swagger
 * /api/feature/getAll:
 *   get:
 *     summary: Get all features
 *     tags: [Feature]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of features
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/getAll', authMiddleWare, checkPermission('features', 'view'), FeatureController.getAllFeatures);

/**
 * @swagger
 * /api/feature/{id}:
 *   get:
 *     summary: Get a feature by ID
 *     tags: [Feature]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feature details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Feature not found
 */
router.get('/:id', authMiddleWare, checkPermission('features', 'view'), FeatureController.getFeatureById);

/**
 * @swagger
 * /api/feature/tree:
 *   get:
 *     summary: Get feature tree
 *     tags: [Feature]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feature tree
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/tree', authMiddleWare, checkPermission('features', 'view'), FeatureController.getFeatureTree);

module.exports = router;