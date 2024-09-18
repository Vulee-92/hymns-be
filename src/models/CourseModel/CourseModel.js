const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        price: { type: Number, required: true },
        duration: { type: String, required: true }, // Ví dụ: "3 months"
        category: { type: String, required: true }, // Ví dụ: "Beginner", "Advanced"
        level: { type: String, enum: ['Basic', 'Intermediate', 'Advanced'], required: true }, // Mức độ khoá học
        mainImage: { type: String, required: true },
        additionalImages: [{ type: String }],
        classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
        isDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
);

// Virtual to calculate total students enrolled in all classes under this course
courseSchema.virtual('totalEnrolledStudents').get(async function () {
    const Class = mongoose.model('Class');
    const classes = await Class.find({ _id: { $in: this.classes } });
    return classes.reduce((acc, cls) => acc + cls.enrolledCount, 0);
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;