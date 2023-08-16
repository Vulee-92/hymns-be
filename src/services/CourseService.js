const Course = require("../models/CourseModel");

const CourseService = {
  createCourse: async (course) => {
    const {
      name,
      description,
      teacher,
      startDate,
      endDate,
      price,
      maximumStudents,
      schedule,
    } = course;

    try {
      const createdCourse = await Course.create({
        name,
        description,
        teacher,
        startDate,
        endDate,
        price,
        maximumStudents,
        schedule,
      });

      if (createdCourse) {
        // await EmailService.sendEmailCreateCourse(createdCourse);
        return {
          status: "OK",
          message: "success",
        };
      }
    } catch (e) {
      console.log("e", e);
      return {
        status: "ERR",
        message: e.message,
      };
    }
  },

  getAllCourses: async () => {
    try {
      const courses = await Course.find().sort({
        createdAt: -1,
        updatedAt: -1,
      });
      return {
        status: "OK",
        message: "Success",
        data: courses,
      };
    } catch (e) {
      return {
        status: "ERR",
        message: e.message,
      };
    }
  },

  getCourseDetails: async (id) => {
    try {
      const course = await Course.findById({ _id: id });
      if (course === null) {
        return {
          status: "ERR",
          message: "The course is not defined",
        };
      }

      return {
        status: "SUCESS",
        message: "SUCCESS",
        data: course,
      };
    } catch (e) {
      return {
        status: "ERR",
        message: e.message,
      };
    }
  },

  enrollUserToCourse: async (userId, courseId) => {
    try {
      const course = await Course.findById(courseId);
      const user = await Order.findById(userId);

      if (course === null || user === null) {
        return {
          status: "ERR",
          message: "The course or user is not defined",
        };
      }

      const enrolledStudents = course.enrolledStudents;

      if (enrolledStudents.length >= course.maximumStudents) {
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
    } catch (e) {
      return {
        status: "ERR",
        message: e.message,
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

module.exports = CourseService;
