const CourseService = require("../services/CourseService");

const createCourse = async (req, res) => {
  try {
    const {
      name,
      description,
      teacher,
      startDate,
      endDate,
      price,
      maximumStudents,
      schedule,
    } = req.body;
    if (
      !name ||
      !description ||
      !teacher ||
      !startDate ||
      !endDate ||
      !price ||
      !maximumStudents ||
      !schedule
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    console.log("req.body", req.body);
    const response = await CourseService.createCourse(req.body);
    console.log("req.response", response);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const response = await CourseService.getAllCourses();
    return res.status(200).json(response);
  } catch (e) {
    // console.log(e)
    return res.status(404).json({
      message: e,
    });
  }
};

const getCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!courseId) {
      return res.status(200).json({
        status: "ERR",
        message: "The courseId is required",
      });
    }
    const response = await CourseService.getCourseDetails(courseId);
    return res.status(200).json(response);
  } catch (e) {
    // console.log(e)
    return res.status(404).json({
      message: e,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const {
      name,
      description,
      teacher,
      startDate,
      endDate,
      price,
      maximumStudents,
      schedule,
    } = req.body;
    const courseId = req.params.id;
    if (!courseId) {
      return res.status(200).json({
        status: "ERR",
        message: "The courseId is required",
      });
    }
    const response = await CourseService.updateCourse(courseId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!courseId) {
      return res.status(200).json({
        status: "ERR",
        message: "The courseId is required",
      });
    }
    const response = await CourseService.deleteCourse(courseId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseDetails,
  updateCourse,
  deleteCourse,
};
