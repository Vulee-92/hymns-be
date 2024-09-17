const CourseService = require("../../services/CourseService/CourseService");

// Tạo môn học mới
const createSubjectController = async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ status: 'ERR', message: 'Name and description are required' });
    }
    try {
        const subject = await CourseService.createSubject(req.body);
        res.status(201).json({ status: 'OK', data: subject });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: 'Failed to create subject: ' + error.message });
    }
};

// Tạo khóa học mới
const createCourseController = async (req, res) => {
    const { title, description, instructor, price, duration, category } = req.body;
    if (!title || !description || !instructor || !price || !duration || !category) {
        return res.status(400).json({ status: 'ERR', message: 'All fields are required' });
    }
    try {
        const course = await CourseService.createCourse(req.body);
        res.status(201).json({ status: 'OK', data: course });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: 'Failed to create course: ' + error.message });
    }
};

// Tạo lớp học mới
const createClassController = async (req, res) => {
    const { subject, title, maxStudents, instructor } = req.body;
    if (!subject || !title || !maxStudents || !instructor) {
        return res.status(400).json({ status: 'ERR', message: 'All fields are required' });
    }
    try {
        const classInstance = await CourseService.createClass(req.body);
        res.status(201).json({ status: 'OK', data: classInstance });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: 'Failed to create class: ' + error.message });
    }
};

// Lấy danh sách tất cả môn học
const getAllSubjectsController = async (req, res) => {
    try {
        const subjects = await CourseService.getAllSubjects();
        res.status(200).json({ status: 'OK', data: subjects });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

// Lấy danh sách tất cả khóa học
const getAllCoursesController = async (req, res) => {
    try {
        const courses = await CourseService.getAllCourses();
        res.status(200).json({ status: 'OK', data: courses });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

// Lấy thông tin chi tiết khóa học
const getCourseByIdController = async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await CourseService.getCourseById(courseId);
        res.status(200).json({ status: 'OK', data: course });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

// Cập nhật thông tin khóa học
const updateCourseController = async (req, res) => {
    const courseId = req.params.id;
    try {
        const updatedCourse = await CourseService.updateCourse(courseId, req.body);
        res.status(200).json({ status: 'OK', data: updatedCourse });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

module.exports = {
    createSubjectController,
    createCourseController,
    createClassController,
    getAllSubjectsController,
    getAllCoursesController,
    getCourseByIdController,
    updateCourseController,
};