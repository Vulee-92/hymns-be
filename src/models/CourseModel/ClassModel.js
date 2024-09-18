const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    isFreeSession: { type: Boolean, default: false }, // Buổi miễn phí (buổi đầu tiên)
    isPresent: { type: Boolean, required: true }, // Trạng thái điểm danh
});

const classSchema = new mongoose.Schema(
    {
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
        title: { type: String, required: true },
        maxStudents: { type: Number, default: 6 }, // Mặc định 6 học viên
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        totalSessions: { type: Number, required: true }, // Tổng số buổi học
        studentProgress: [{
            student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            attendedSessions: { type: Number, default: 0 }, // Số buổi học đã tham gia
            remainingSessions: { type: Number, required: true }, // Số buổi còn lại
        }],
        attendance: [attendanceSchema], // Mảng lưu trữ điểm danh
        schedule: [{
            dayOfWeek: { type: String, required: true }, // Ví dụ: "Tuesday", "Thursday"
            timeSlot: { type: String, required: true }, // Ví dụ: "5:30 PM - 7:00 PM"
        }],
        startDate: { type: Date, required: true },
        isDeleted: { type: Boolean, default: false },
        mainImage: { type: String, required: true },
        additionalImages: [{ type: String }],
    },
    {
        timestamps: true,
    }
);

// Virtual to auto-calculate enrolled students
classSchema.virtual('enrolledCount').get(function () {
    return this.studentProgress.length;
});

// Virtual to calculate remaining sessions for each student
classSchema.virtual('calculateRemainingSessions').get(function () {
    return this.totalSessions - this.attendance.filter(a => a.isPresent).length;
});

const Class = mongoose.model("Class", classSchema);
module.exports = Class;