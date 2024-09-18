const CourseService = require("../../services/CourseService/CourseService");

const createCourseController = async (req, res) => {
    try {
        const course = await CourseService.createCourse(req.body);
        res.status(201).json({ status: 'OK', data: course });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: 'Failed to create course: ' + error.message });
    }
};

const getAllCoursesController = async (req, res) => {
    try {
        const courses = await CourseService.getAllCourses();
        res.status(200).json({ status: 'OK', data: courses });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

const getCourseByIdController = async (req, res) => {
    try {
        const course = await CourseService.getCourseById(req.params.id);
        res.status(200).json({ status: 'OK', data: course });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const updateCourseController = async (req, res) => {
    try {
        const updatedCourse = await CourseService.updateCourse(req.params.id, req.body);
        res.status(200).json({ status: 'OK', data: updatedCourse });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const softDeleteCourseController = async (req, res) => {
    try {
        await CourseService.softDeleteCourse(req.params.id);
        res.status(200).json({ status: 'OK', message: 'Course soft deleted successfully' });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const softDeleteMultipleCoursesController = async (req, res) => {
    try {
        await CourseService.softDeleteMultipleCourses(req.body.ids);
        res.status(200).json({ status: 'OK', message: 'Courses soft deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

module.exports = {
    createCourseController,
    getAllCoursesController,
    getCourseByIdController,
    updateCourseController,
    softDeleteCourseController,
    softDeleteMultipleCoursesController,
};