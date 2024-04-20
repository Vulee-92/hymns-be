const express = require("express");
const router = express.Router();
const CateProductController = require("../controllers/CateProductController");

router.post("/create",CateProductController.createCate);
router.get("/get-all",CateProductController.getAllCate);

module.exports = router;