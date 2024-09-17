const Course = require("../../models/CourseModel/CourseModel");
const Subject = require("../../models/CourseModel/SubjectModel");
const Class = require("../../models/CourseModel/ClassModel");

// Tạo môn học mới
const createSubject = async (subjectData) => {
    const subject = new Subject(subjectData);
    await subject.save();
    return subject;
};

// Tạo khóa học mới
const createCourse = async (courseData) => {
    const course = new Course(courseData);
    await course.save();
    return course;
};

// Tạo lớp học mới
const createClass = async (classData) => {
    const classInstance = new Class(classData);
    await classInstance.save();
    return classInstance;
};

// Lấy danh sách tất cả môn học
const getAllSubjects = async () => {
    return await Subject.find().populate('courses'); // Lấy thông tin khóa học liên quan
};

// Lấy danh sách tất cả khóa học
const getAllCourses = async () => {
    return await Course.find().populate('instructor classes'); // Lấy thông tin người dạy và lớp học
};

// Lấy thông tin chi tiết khóa học
const getCourseById = async (courseId) => {
    const course = await Course.findById(courseId).populate('instructor classes');
    if (!course) {
        throw new Error('Course not found');
    }
    return course;
};

// Cập nhật thông tin khóa học
const updateCourse = async (courseId, courseData) => {
    const updatedCourse = await Course.findByIdAndUpdate(courseId, courseData, { new: true });
    if (!updatedCourse) {
        throw new Error('Course not found');
    }
    return updatedCourse;
};

module.exports = {
    createSubject,
    createCourse,
    createClass,
    getAllSubjects,
    getAllCourses,
    getCourseById,
    updateCourse,
};