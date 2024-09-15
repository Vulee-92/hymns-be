const express = require('express');
const router = express.Router();
const BannerController = require('../controllers/BannerController');
const { authMiddleWare, checkPermission } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/banner/create:
 *   post:
 *     summary: Create a new banner
 *     tags: [Banner]
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
 *               season:
 *                 type: string
 *               mainImages:
 *                 type: object
 *                 properties:
 *                   desktop:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Image'
 *                   mobile:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Image'
 *               subImages:
 *                 type: object
 *                 properties:
 *                   desktop:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Image'
 *                   mobile:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Image'
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Banner created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/create',  BannerController.createBanner);

/**
 * @swagger
 * /api/banner/update/{id}:
 *   put:
 *     summary: Update a banner
 *     tags: [Banner]
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
 *             $ref: '#/components/schemas/Banner'
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server error
 */
router.put('/update/:id', authMiddleWare, checkPermission('edit'), BannerController.updateBanner);

/**
 * @swagger
 * /api/banner/getAll:
 *   get:
 *     summary: Get all banners
 *     tags: [Banner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all banners
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/getAll', authMiddleWare, checkPermission('view'), BannerController.getAllBanners);

/**
 * @swagger
 * /api/banner/active:
 *   get:
 *     summary: Get active banner
 *     tags: [Banner]
 *     responses:
 *       200:
 *         description: Active banner
 *       404:
 *         description: No active banner found
 *       500:
 *         description: Server error
 */
router.get('/active', BannerController.getActiveBanner);

/**
 * @swagger
 * /api/banner/delete/{id}:
 *   delete:
 *     summary: Delete a banner
 *     tags: [Banner]
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
 *         description: Banner deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:id', authMiddleWare, checkPermission('delete'), BannerController.deleteBanner);

module.exports = router;