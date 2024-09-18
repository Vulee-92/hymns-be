const Course = require("../../models/CourseModel/CourseModel");

const createCourse = async (courseData) => {
    const course = new Course(courseData);
    await course.save();
    return course;
};

const getAllCourses = async () => {
    return await Course.find({ isDeleted: false }).populate('instructor classes');
};

const getCourseById = async (courseId) => {
    const course = await Course.findById(courseId).populate('instructor classes');
    if (!course) {
        throw new Error('Course not found');
    }
    return course;
};

const updateCourse = async (courseId, courseData) => {
    const updatedCourse = await Course.findByIdAndUpdate(courseId, courseData, { new: true });
    if (!updatedCourse) {
        throw new Error('Course not found');
    }
    return updatedCourse;
};

const softDeleteCourse = async (courseId) => {
    const result = await Course.findByIdAndUpdate(courseId, { isDeleted: true }, { new: true });
    if (!result) {
        throw new Error('Course not found');
    }
    return result;
};

const softDeleteMultipleCourses = async (courseIds) => {
    await Course.updateMany({ _id: { $in: courseIds } }, { isDeleted: true });
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    softDeleteCourse,
    softDeleteMultipleCourses,
};