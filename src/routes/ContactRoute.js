const express = require("express");
const router = express.Router();
const ContactController = require("../controllers/ContactController");
/**
 * @swagger
 * /api/contact/delete-multiple:
 *   delete:
 *     summary: Delete multiple contacts
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of contact IDs to delete
 *     responses:
 *       200:
 *         description: Contacts deleted successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.delete("/delete-multiple", ContactController.deleteMultipleContacts);
/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - contactmessenger
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               contactmessenger:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", ContactController.createContact);

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: List of all contacts
 *       500:
 *         description: Server error
 */
router.get("/", ContactController.getAllContacts);

/**
 * @swagger
 * /api/contact/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact details
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.get("/:id", ContactController.getContactById);

/**
 * @swagger
 * /api/contact/{id}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contact]
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
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               contactmessenger:
 *                 type: string
 *               subject:
 *                 type: string
 *               status:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.put("/:id", ContactController.updateContact);

/**
 * @swagger
 * /api/contact/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", ContactController.deleteContact);

module.exports = router;