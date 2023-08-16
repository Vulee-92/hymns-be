const Course = require("../models/CourseModel");
const User = require("../models/UserModel");

const EnrollmentService = {
  enrollUserToCourse: async (userId, courseId) => {
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (course === null || user === null) {
      return {
        status: "ERR",
        message: "The course or user is not defined",
      };
    }

    const enrolledStudents = course.enrolledStudents;

    if (enrolledStudents.length >= 5) {
      return {
        status: "ERR",
        message: "Lớp học đã kín chỗ",
      };
    }

    const enrollment = new Enrollment({
      courseId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (await Enrollment.create(enrollment)) {
      return {
        status: "OK",
        message: "success",
      };
    } else {
      return {
        status: "ERR",
        message: "Something went wrong",
      };
    }
  },

  getCourseEnrollmentStatus: async (courseId) => {
    const course = await Course.findById(courseId);
    const enrolledStudents = course.enrolledStudents;

    if (enrolledStudents.length >= 5) {
      return {
        status: "full",
        message: "Lớp học đã kín chỗ",
      };
    } else {
      return {
        status: "available",
        message: "Lớp học vẫn còn chỗ trống",
      };
    }
  },
};

module.exports = EnrollmentService;
