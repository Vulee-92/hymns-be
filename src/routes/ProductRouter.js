const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

// Thêm route mới cho giải mã
router.post("/decrypt", ProductController.decryptData);

// Các routes hiện tại
router.post("/create", ProductController.createProduct);
router.put("/update/:id", ProductController.updateProduct);
router.get("/p/:id", ProductController.getDetailsProduct);
router.delete("/delete/:id", ProductController.deleteProduct);
router.get('/get-all/:collections?', ProductController.getAllProduct);
router.get('/get-all/collections/:brand?', ProductController.getAllProductAllowBrand);
router.post("/delete-many", ProductController.deleteMany);
router.get("/get-all-type", ProductController.getAllType);
router.get("/get-all-brand", ProductController.getAllBrand);
router.get("/search", ProductController.searchProduct);

module.exports = router;