const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    },
    {
        timestamps: true,
    }
);

// Virtual to calculate total enrolled students in a subject
subjectSchema.virtual('totalEnrolledStudents').get(async function () {
    const Course = mongoose.model('Course');
    const courses = await Course.find({ _id: { $in: this.courses } });
    let totalStudents = 0;
    for (const course of courses) {
        totalStudents += await course.totalEnrolledStudents;
    }
    return totalStudents;
});

const Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;
