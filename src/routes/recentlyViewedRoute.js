const express = require('express');
const router = express.Router();
const RecentlyViewedController = require('../controllers/RecentlyViewedController');
/**
 * @swagger
 * /api/recently-viewed/update/{productSlug}/{userId}:
 *   get:
 *     summary: Update recently viewed products for a user
 *     tags: [RecentlyViewed]
 *     parameters:
 *       - in: path
 *         name: productSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the viewed product
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Recently viewed products updated successfully
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
 *                   example: Recently viewed updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: user123
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                             example: 60d5ecb54f3f7f2a8c1e7b1a
 *                           name:
 *                             type: string
 *                             example: Sample Product
 *                           image:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["http://example.com/image.jpg"]
 *                           price:
 *                             type: number
 *                             example: 99.99
 *                           slug:
 *                             type: string
 *                             example: sample-product
 *                           countInStock:
 *                             type: number
 *                             example: 10
 *                           timestamp:
 *                             type: string
 *                             format: date-time
 *                           viewCount:
 *                             type: number
 *                             example: 1
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get('/update/:id/:userId', RecentlyViewedController.updateRecentlyViewed);
/**
 * @swagger
 * /api/recently-viewed/{userId}:
 *   get:
 *     summary: Get recently viewed products for a user
 *     tags: [RecentlyViewed]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Recently viewed products retrieved successfully
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
 *                   example: Recently viewed products retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: user123
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 60d5ecb54f3f7f2a8c1e7b1a
 *                               name:
 *                                 type: string
 *                                 example: Sample Product
 *                               description:
 *                                 type: string
 *                                 example: This is a sample product
 *                           name:
 *                             type: string
 *                             example: Sample Product
 *                           image:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["http://example.com/image.jpg"]
 *                           price:
 *                             type: number
 *                             example: 99.99
 *                           slug:
 *                             type: string
 *                             example: sample-product
 *                           countInStock:
 *                             type: number
 *                             example: 10
 *                           timestamp:
 *                             type: string
 *                             format: date-time
 *                           viewCount:
 *                             type: number
 *                             example: 1
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get('/:id', RecentlyViewedController.getRecentlyViewed);
/**
 * @swagger
 * /api/recently-viewed/update/{productSlug}/{userId}:
 *   get:
 *     summary: Update recently viewed products for a user
 *     tags: [RecentlyViewed]
 *     parameters:
 *       - in: path
 *         name: productSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the viewed product
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Recently viewed products updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get('/update/:id/:userId', RecentlyViewedController.updateRecentlyViewed);

/**
 * @swagger
 * /api/recently-viewed/{userId}:
 *   get:
 *     summary: Get recently viewed products for a user
 *     tags: [RecentlyViewed]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Recently viewed products retrieved successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get('/:id', RecentlyViewedController.getRecentlyViewed);

module.exports = router;