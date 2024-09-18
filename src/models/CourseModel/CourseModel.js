const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
        price: { type: Number, required: true },
        duration: { type: String, required: true },
        category: { type: String, required: true },
        level: { type: String, enum: ['Basic', 'Intermediate', 'Advanced'], required: true },
        mainImage: { type: String, required: true },
        additionalImages: [{ type: String }],
        classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
        isDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
);

courseSchema.virtual('totalEnrolledStudents').get(async function () {
    const Class = mongoose.model('Class');
    const classes = await Class.find({ _id: { $in: this.classes } });
    return classes.reduce((acc, cls) => acc + cls.enrolledCount, 0);
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;