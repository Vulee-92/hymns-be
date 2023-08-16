const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  // _id: { type: mongoose.Types.ObjectId },
  name: { type: String, required: true },
  description: { type: String },
  teacher: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  price: { type: Number },
  maximumStudents: { type: Number },
  enrollments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
    },
  ],
  schedule: [
    {
      week: { type: Number },
      day: { type: String },
      start: { type: Date },
      end: { type: Date },
    },
  ],
});

module.exports = mongoose.model("Course", CourseSchema);
