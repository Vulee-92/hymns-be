const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // Tên loại môn học (VD: Guitar, Piano, Drums)
        description: { type: String }, // Mô tả về loại môn học
        mainImage: { type: String, required: true }, // Hình ảnh chính cho loại môn học
        additionalImages: [{ type: String }], // Hình ảnh bổ sung
        courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Liên kết tới các khoá học
        isDeleted: { type: Boolean, default: false } // Đánh dấu loại môn học đã bị xóa
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