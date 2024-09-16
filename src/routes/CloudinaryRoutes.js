const express = require('express');
const multer = require('multer');
const { uploadImage, deleteImage, updateImage, getAllImages } = require('../controllers/CloudinaryController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/images/upload:
 *   post:
 *     summary: Upload a new image
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageBase64:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       500:
 *         description: Error uploading image
 */
router.post('/upload', uploadImage);

/**
 * @swagger
 * /api/images/{id}:
 *   delete:
 *     summary: Delete an image
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       500:
 *         description: Error deleting image
 */
router.delete('/:id', deleteImage);

/**
 * @swagger
 * /api/images/{id}:
 *   put:
 *     summary: Update an image
 *     tags: [Images]
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
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image updated successfully
 *       500:
 *         description: Error updating image
 */
router.put('/:id', updateImage);

/**
 * @swagger
 * /api/images:
 *   get:
 *     summary: Get all images
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: Images retrieved successfully
 *       500:
 *         description: Error retrieving images
 */
router.get('/', getAllImages);

module.exports = router;