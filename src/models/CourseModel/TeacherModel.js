const teacherSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Liên kết tới User
    teachingSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }], // Môn học mà giáo viên dạy
    teachingClasses: [{
      classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // Các lớp học mà giáo viên đang dạy
      students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }] // Học viên trong lớp
    }],
    feedbacks: [{
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // Học sinh được đánh giá
      comments: { type: String }, // Nhận xét của giáo viên
      date: { type: Date, default: Date.now } // Ngày nhận xét
    }],
    isActive: { type: Boolean, default: true }
  }, {
    timestamps: true
  });
  
  const Teacher = mongoose.model('Teacher', teacherSchema);
  module.exports = Teacher;
  