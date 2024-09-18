const Class = require("../../models/CourseModel/ClassModel");

const createClass = async (classData) => {
    const classInstance = new Class(classData);
    await classInstance.save();
    return classInstance;
};

const getAllClasses = async () => {
    return await Class.find({ isDeleted: false }).populate('subject instructor course');
};

const getClassById = async (classId) => {
    const classInstance = await Class.findById(classId).populate('subject instructor course students');
    if (!classInstance) {
        throw new Error('Class not found');
    }
    return classInstance;
};

const updateClass = async (classId, classData) => {
    const updatedClass = await Class.findByIdAndUpdate(classId, classData, { new: true });
    if (!updatedClass) {
        throw new Error('Class not found');
    }
    return updatedClass;
};

const softDeleteClass = async (classId) => {
    const result = await Class.findByIdAndUpdate(classId, { isDeleted: true }, { new: true });
    if (!result) {
        throw new Error('Class not found');
    }
    return result;
};

const softDeleteMultipleClasses = async (classIds) => {
    await Class.updateMany({ _id: { $in: classIds } }, { isDeleted: true });
};

module.exports = {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    softDeleteClass,
    softDeleteMultipleClasses,
};