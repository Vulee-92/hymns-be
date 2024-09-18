const Subject = require("../../models/CourseModel/SubjectModel");

const createSubject = async (subjectData) => {
    const subject = new Subject(subjectData);
    await subject.save();
    return subject;
};

const getAllSubjects = async () => {
    return await Subject.find({ isDeleted: false }).populate('courses');
};

const getSubjectById = async (subjectId) => {
    const subject = await Subject.findById(subjectId).populate('courses');
    if (!subject) {
        throw new Error('Subject not found');
    }
    return subject;
};

const updateSubject = async (subjectId, subjectData) => {
    const updatedSubject = await Subject.findByIdAndUpdate(subjectId, subjectData, { new: true });
    if (!updatedSubject) {
        throw new Error('Subject not found');
    }
    return updatedSubject;
};

const softDeleteSubject = async (subjectId) => {
    const result = await Subject.findByIdAndUpdate(subjectId, { isDeleted: true }, { new: true });
    if (!result) {
        throw new Error('Subject not found');
    }
    return result;
};

const softDeleteMultipleSubjects = async (subjectIds) => {
    await Subject.updateMany({ _id: { $in: subjectIds } }, { isDeleted: true });
};

module.exports = {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    softDeleteSubject,
    softDeleteMultipleSubjects,
};