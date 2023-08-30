const express = require("express");
const router = express.Router();
const ContactController = require("../controllers/ContactController");

router.post("/create-contact", ContactController.createContact);

module.exports = router;
