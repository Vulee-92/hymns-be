const SubjectService = require("../services/SubjectService");

const createSubjectController = async (req, res) => {
    try {
        const subject = await SubjectService.createSubject(req.body);
        res.status(201).json({ status: 'OK', data: subject });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: 'Failed to create subject: ' + error.message });
    }
};

const getAllSubjectsController = async (req, res) => {
    try {
        const subjects = await SubjectService.getAllSubjects();
        res.status(200).json({ status: 'OK', data: subjects });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

const getSubjectByIdController = async (req, res) => {
    try {
        const subject = await SubjectService.getSubjectById(req.params.id);
        res.status(200).json({ status: 'OK', data: subject });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const updateSubjectController = async (req, res) => {
    try {
        const updatedSubject = await SubjectService.updateSubject(req.params.id, req.body);
        res.status(200).json({ status: 'OK', data: updatedSubject });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const softDeleteSubjectController = async (req, res) => {
    try {
        await SubjectService.softDeleteSubject(req.params.id);
        res.status(200).json({ status: 'OK', message: 'Subject soft deleted successfully' });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const softDeleteMultipleSubjectsController = async (req, res) => {
    try {
        await SubjectService.softDeleteMultipleSubjects(req.body.ids);
        res.status(200).json({ status: 'OK', message: 'Subjects soft deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

module.exports = {
    createSubjectController,
    getAllSubjectsController,
    getSubjectByIdController,
    updateSubjectController,
    softDeleteSubjectController,
    softDeleteMultipleSubjectsController,
};