const Attendance = require("../models/AttendanceModel");
const Class = require("../models/ClassModel");

const markAttendance = async (studentId, classId, date) => {
    const classInstance = await Class.findById(classId);
    if (!classInstance) {
        throw new Error('Class not found');
    }

    const isFreeSession = classInstance.attendance.length === 0;
    const attendance = new Attendance({ student: studentId, class: classId, date, isFreeSession, isPresent: true });
    await attendance.save();

    if (!isFreeSession) {
        classInstance.totalSessions -= 1;
        await classInstance.save();
    }

    return attendance;
};

const rollbackAttendance = async (studentId, classId, date) => {
    const attendance = await Attendance.findOneAndDelete({ student: studentId, class: classId, date });
    if (!attendance) {
        throw new Error('Attendance record not found');
    }

    const classInstance = await Class.findById(classId);
    if (!classInstance) {
        throw new Error('Class not found');
    }

    if (!attendance.isFreeSession) {
        classInstance.totalSessions += 1;
        await classInstance.save();
    }

    return attendance;
};

module.exports = {
    markAttendance,
    rollbackAttendance,
};