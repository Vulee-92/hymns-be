const express = require('express');
const multer = require('multer');
const { uploadImageController } = require('../controllers/CloudinaryController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Sử dụng bộ nhớ tạm

router.post('/upload', upload.single('image'), uploadImageController);

module.exports = router;