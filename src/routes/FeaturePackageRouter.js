const express = require('express');
const router = express.Router();
const FeaturePackageController = require('../controllers/FeaturePackageController');
const { authMiddleWare, checkPermission } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: FeaturePackage
 *   description: API for managing feature packages
 */

/**
 * @swagger
 * /api/feature-package/create:
 *   post:
 *     summary: Create a new feature package
 *     tags: [FeaturePackage]
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
 *               code:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     feature:
 *                       type: string
 *                     access:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Feature package created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/create',  FeaturePackageController.createFeaturePackage);

// Thêm các route khác cho update và getAll

module.exports = router;