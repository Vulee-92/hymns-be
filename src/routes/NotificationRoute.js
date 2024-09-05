const express = require('express');
const notificationController = require('../controllers/NotificationController');
const router = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Stream order notifications
 *     tags: [Notifications]
 *     description: Establishes a Server-Sent Events connection to stream order notifications
 *     responses:
 *       200:
 *         description: Successful connection established
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                   description: Full name of the customer
 *                 codeOrder:
 *                   type: string
 *                   description: Order code
 *                 orderItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Name of the product
 *                       slug:
 *                         type: string
 *                         description: Slug of the product
 *                       image:
 *                         type: string
 *                         description: URL of the product image
 *       500:
 *         description: Server error
 */
router.get('/', notificationController.getOrderNotifications);

module.exports = router;