const EnrollmentService = require("../services/EnrollmentService");

const createEnrollment = async (req, res) => {
  try {
    const { courseId, userId, enrollmentDate, enrollmentStatus } = req.body;
    if (!courseId || !userId || !enrollmentDate || !enrollmentStatus) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await EnrollmentService.createEnrollment(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllEnrollments = async (req, res) => {
  try {
    const response = await EnrollmentService.getAllEnrollments();
    return res.status(200).json(response);
  } catch (e) {
    // console.log(e)
    return res.status(404).json({
      message: e,
    });
  }
};

const getEnrollmentDetails = async (req, res) => {
  try {
    const enrollmentId = req.params.id;
    if (!enrollmentId) {
      return res.status(200).json({
        status: "ERR",
        message: "The enrollmentId is required",
      });
    }
    const response = await EnrollmentService.getEnrollmentDetails(enrollmentId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateEnrollment = async (req, res) => {
  try {
    const { enrollmentId, courseId, userId, enrollmentDate, enrollmentStatus } =
      req.body;
    if (!enrollmentId) {
      return res.status(200).json({
        status: "ERR",
        message: "The enrollmentId is required",
      });
    }
    const response = await EnrollmentService.updateEnrollment(
      enrollmentId,
      req.body
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    const enrollmentId = req.params.id;
    if (!enrollmentId) {
      return res.status(200).json({
        status: "ERR",
        message: "The enrollmentId is required",
      });
    }
    const response = await EnrollmentService.deleteEnrollment(enrollmentId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentDetails,
  updateEnrollment,
  deleteEnrollment,
};
