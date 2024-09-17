const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
    {
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
        title: { type: String, required: true },
        maxStudents: { type: Number, required: true },
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of enrolled students
        startDate: { type: Date, required: true }, // Ngày bắt đầu học
    },
    {
        timestamps: true,
    }
);

// Virtual to auto-calculate enrolled students
classSchema.virtual('enrolledCount').get(function () {
    return this.students.length;
});

const Class = mongoose.model("Class", classSchema);
module.exports = Class;
