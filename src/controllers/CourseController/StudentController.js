const StudentService = require("../services/StudentService");

const createStudentController = async (req, res) => {
    try {
        const student = await StudentService.createStudent(req.body);
        res.status(201).json({ status: 'OK', data: student });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: 'Failed to create student: ' + error.message });
    }
};

const getAllStudentsController = async (req, res) => {
    try {
        const students = await StudentService.getAllStudents();
        res.status(200).json({ status: 'OK', data: students });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

const getStudentByIdController = async (req, res) => {
    try {
        const student = await StudentService.getStudentById(req.params.id);
        res.status(200).json({ status: 'OK', data: student });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const updateStudentController = async (req, res) => {
    try {
        const updatedStudent = await StudentService.updateStudent(req.params.id, req.body);
        res.status(200).json({ status: 'OK', data: updatedStudent });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const softDeleteStudentController = async (req, res) => {
    try {
        await StudentService.softDeleteStudent(req.params.id);
        res.status(200).json({ status: 'OK', message: 'Student soft deleted successfully' });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const softDeleteMultipleStudentsController = async (req, res) => {
    try {
        await StudentService.softDeleteMultipleStudents(req.body.ids);
        res.status(200).json({ status: 'OK', message: 'Students soft deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

module.exports = {
    createStudentController,
    getAllStudentsController,
    getStudentByIdController,
    updateStudentController,
    softDeleteStudentController,
    softDeleteMultipleStudentsController,
};