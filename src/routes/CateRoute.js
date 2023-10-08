const express = require("express");
const router = express.Router();
const CateController = require("../controllers/BlogCateController");

router.post("/create-cate", CateController.createCate);

module.exports = router;