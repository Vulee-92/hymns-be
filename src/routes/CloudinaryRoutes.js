const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImageController } = require('../controllers/CloudinaryController');

// Multer để lưu file tạm thời
const storage = multer.memoryStorage(); // Lưu vào bộ nhớ tạm
const upload = multer({ storage: storage }); // Lưu file vào bộ nhớ tạm

router.post('/upload-banner', upload.single('imageBase64'), uploadImageController);

module.exports = router;
