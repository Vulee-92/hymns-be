const express = require("express");
const router = express.Router();
const CourseController = require("../controllers/CoureController");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post("/create", CourseController.createCourse);
router.put("/update/:id", authMiddleWare, CourseController.updateCourse);
router.get("/get-details/:id", CourseController.getCourseDetails);
router.delete("/delete/:id", authMiddleWare, CourseController.deleteCourse);
router.get("/get-all", CourseController.getAllCourses);

module.exports = router;
