const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId },
  courseId: { type: mongoose.Types.ObjectId, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true },
  enrollmentDate: { type: Date },
  enrollmentStatus: { type: String },
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
