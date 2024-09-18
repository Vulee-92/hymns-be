const Student = require("../models/StudentModel");

const createStudent = async (studentData) => {
    const student = new Student(studentData);
    await student.save();
    return student;
};

const getAllStudents = async () => {
    return await Student.find({ isDeleted: false }).populate('user enrolledClasses');
};

const getStudentById = async (studentId) => {
    const student = await Student.findById(studentId).populate('user enrolledClasses');
    if (!student) {
        throw new Error('Student not found');
    }
    return student;
};

const updateStudent = async (studentId, studentData) => {
    const updatedStudent = await Student.findByIdAndUpdate(studentId, studentData, { new: true });
    if (!updatedStudent) {
        throw new Error('Student not found');
    }
    return updatedStudent;
};

const softDeleteStudent = async (studentId) => {
    const result = await Student.findByIdAndUpdate(studentId, { isDeleted: true }, { new: true });
    if (!result) {
        throw new Error('Student not found');
    }
    return result;
};

const softDeleteMultipleStudents = async (studentIds) => {
    await Student.updateMany({ _id: { $in: studentIds } }, { isDeleted: true });
};

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    softDeleteStudent,
    softDeleteMultipleStudents,
};