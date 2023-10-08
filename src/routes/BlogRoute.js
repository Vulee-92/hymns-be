const express = require("express");
const router = express.Router();
const BlogController = require("../controllers/BlogController");
const { authMiddleWare } = require("../middleware/authMiddleware");
router.post("/create-blog", BlogController.createBlog);
router.get("/get-all-blog", BlogController.getAllBlog);
router.get("/get-details/:id", BlogController.getDetailsBlog);
router.put("/update/:id",  authMiddleWare,BlogController.updateBlog);
router.delete("/delete/:id",  authMiddleWare, BlogController.deleteBlog);
router.post("/delete-many",  authMiddleWare,BlogController.deleteMany);
router.get("/get-all-type", BlogController.getAllType);
module.exports = router;