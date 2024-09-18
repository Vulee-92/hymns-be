const AttendanceService = require("../../services/CourseService/AttendanceService");

const markAttendanceController = async (req, res) => {
    const { studentId, classId, date } = req.body;
    if (!studentId || !classId || !date) {
        return res.status(400).json({ status: 'ERR', message: 'Student ID, Class ID, and Date are required' });
    }
    try {
        const attendance = await AttendanceService.markAttendance(studentId, classId, date);
        res.status(201).json({ status: 'OK', data: attendance });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: 'Failed to mark attendance: ' + error.message });
    }
};

const rollbackAttendanceController = async (req, res) => {
    const { studentId, classId, date } = req.body;
    if (!studentId || !classId || !date) {
        return res.status(400).json({ status: 'ERR', message: 'Student ID, Class ID, and Date are required' });
    }
    try {
        const attendance = await AttendanceService.rollbackAttendance(studentId, classId, date);
        res.status(200).json({ status: 'OK', data: attendance });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: 'Failed to rollback attendance: ' + error.message });
    }
};

module.exports = {
    markAttendanceController,
    rollbackAttendanceController,
};