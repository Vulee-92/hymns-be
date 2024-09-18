const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
    {
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
        title: { type: String, required: true },
        capacity: { type: Number, default: 6 },
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        totalSessions: { type: Number, required: true },
        studentProgress: [{
            student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            attendedSessions: { type: Number, default: 0 },
            remainingSessions: { type: Number, required: true },
        }],
        schedule: [{
            dayOfWeek: { type: String, required: true },
            timeSlot: { type: String, required: true },
        }],
        startDate: { type: Date, required: true },
        mainImage: { type: String, required: true },
        additionalImages: [{ type: String }],
        isDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
);

classSchema.virtual('enrolledCount').get(function () {
    return this.studentProgress.length;
});

classSchema.virtual('calculateRemainingSessions').get(function () {
    return this.totalSessions - this.studentProgress.reduce((acc, student) => acc + student.attendedSessions, 0);
});

const Class = mongoose.model("Class", classSchema);
module.exports = Class;