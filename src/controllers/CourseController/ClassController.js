const ClassService = require("../services/ClassService");

const createClassController = async (req, res) => {
    try {
        const classInstance = await ClassService.createClass(req.body);
        res.status(201).json({ status: 'OK', data: classInstance });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: 'Failed to create class: ' + error.message });
    }
};

const getAllClassesController = async (req, res) => {
    try {
        const classes = await ClassService.getAllClasses();
        res.status(200).json({ status: 'OK', data: classes });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

const getClassByIdController = async (req, res) => {
    try {
        const classInstance = await ClassService.getClassById(req.params.id);
        res.status(200).json({ status: 'OK', data: classInstance });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const updateClassController = async (req, res) => {
    try {
        const updatedClass = await ClassService.updateClass(req.params.id, req.body);
        res.status(200).json({ status: 'OK', data: updatedClass });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const softDeleteClassController = async (req, res) => {
    try {
        await ClassService.softDeleteClass(req.params.id);
        res.status(200).json({ status: 'OK', message: 'Class soft deleted successfully' });
    } catch (error) {
        res.status(404).json({ status: 'ERR', message: error.message });
    }
};

const softDeleteMultipleClassesController = async (req, res) => {
    try {
        await ClassService.softDeleteMultipleClasses(req.body.ids);
        res.status(200).json({ status: 'OK', message: 'Classes soft deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

module.exports = {
    createClassController,
    getAllClassesController,
    getClassByIdController,
    updateClassController,
    softDeleteClassController,
    softDeleteMultipleClassesController,
};