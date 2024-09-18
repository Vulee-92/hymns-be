const TeacherService = require("../../services/CourseService/TeacherService");

const createTeacherController = async (req, res) => {
    try {
        const teacher = await TeacherService.createTeacher(req.body);
        res.status(201).json({ status: 'OK', data: teacher });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: 'Failed to create teacher: ' + error.message });
    }
};

const getAllTeachersController = async (req, res) => {
    try {
        const teachers = await TeacherService.getAllTeachers();
        res.status(200).json({ status: 'OK', data: teachers });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

const getTeacherByIdController = async (req, res) => {
    try {
        const teacher = await TeacherService.getTeacherById(req.params.id);
        res.status(200).json({ status: 'OK', data: teacher });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const updateTeacherController = async (req, res) => {
    try {
        const updatedTeacher = await TeacherService.updateTeacher(req.params.id, req.body);
        res.status(200).json({ status: 'OK', data: updatedTeacher });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const softDeleteTeacherController = async (req, res) => {
    try {
        await TeacherService.softDeleteTeacher(req.params.id);
        res.status(200).json({ status: 'OK', message: 'Teacher soft deleted successfully' });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const softDeleteMultipleTeachersController = async (req, res) => {
    try {
        await TeacherService.softDeleteMultipleTeachers(req.body.ids);
        res.status(200).json({ status: 'OK', message: 'Teachers soft deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

module.exports = {
    createTeacherController,
    getAllTeachersController,
    getTeacherByIdController,
    updateTeacherController,
    softDeleteTeacherController,
    softDeleteMultipleTeachersController,
};