const Teacher = require("../models/TeacherModel");

const createTeacher = async (teacherData) => {
    const teacher = new Teacher(teacherData);
    await teacher.save();
    return teacher;
};

const getAllTeachers = async () => {
    return await Teacher.find({ isDeleted: false }).populate('user teachingSubjects teachingClasses');
};

const getTeacherById = async (teacherId) => {
    const teacher = await Teacher.findById(teacherId).populate('user teachingSubjects teachingClasses');
    if (!teacher) {
        throw new Error('Teacher not found');
    }
    return teacher;
};

const updateTeacher = async (teacherId, teacherData) => {
    const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, teacherData, { new: true });
    if (!updatedTeacher) {
        throw new Error('Teacher not found');
    }
    return updatedTeacher;
};

const softDeleteTeacher = async (teacherId) => {
    const result = await Teacher.findByIdAndUpdate(teacherId, { isDeleted: true }, { new: true });
    if (!result) {
        throw new Error('Teacher not found');
    }
    return result;
};

const softDeleteMultipleTeachers = async (teacherIds) => {
    await Teacher.updateMany({ _id: { $in: teacherIds } }, { isDeleted: true });
};

module.exports = {
    createTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    softDeleteTeacher,
    softDeleteMultipleTeachers,
};