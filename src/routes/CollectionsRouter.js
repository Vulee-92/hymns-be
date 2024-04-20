const express = require("express");
const router = express.Router();
const CollectionsProductController = require("../controllers/CollectionsController");

router.post("/create",CollectionsProductController.createCollection);
router.get("/get-all",CollectionsProductController.getAllCollections);

module.exports = router;