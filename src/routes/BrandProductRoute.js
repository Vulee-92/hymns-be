const express = require("express");
const router = express.Router();
const BrandProductController = require("../controllers/BrandProductController");

router.post("/create",BrandProductController.createBrand);
router.get("/get-all",BrandProductController.getAllBrand);

module.exports = router;