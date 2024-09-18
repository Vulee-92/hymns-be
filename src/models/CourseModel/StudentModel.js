const mongoose = require('mongoose');

// Mô hình Student
const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Liên kết tới User
  enrolledClasses: [{
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // Lớp đã đăng ký
    subjectType: { type: String, required: true } // Loại môn học (VD: Guitar, Piano)
  }],
  progress: { 
    type: Map, // Theo dõi tiến độ của từng lớp học
    of: { 
      attendedSessions: { type: Number, default: 0 }, // Số buổi đã tham gia
      remainingSessions: { type: Number, required: true }, // Số buổi còn lại
      progressPercentage: { type: Number, default: 0 } // Tiến độ tính theo %
    }
  },
  grades: [{
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // Lớp học liên quan
    score: { type: Number }, // Điểm của lớp học đó
    comments: { type: String } // Nhận xét của giáo viên
  }],
  attendance: [{
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // Lớp học mà học sinh được điểm danh
    subjectType: { type: String }, // Loại môn học
    date: { type: Date, default: Date.now }, // Thời gian điểm danh
    status: { type: String, default: 'present' } // Trạng thái điểm danh
  }],
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Logic để kiểm tra đăng ký
studentSchema.methods.registerClass = async function (classId, subjectType) {
  const alreadyRegistered = this.enrolledClasses.some(
    (c) => c.subjectType === subjectType
  );
  
  if (alreadyRegistered) {
    throw new Error(`Học viên đã đăng ký môn học thuộc loại ${subjectType}.`);
  }

  this.enrolledClasses.push({ classId, subjectType });
  await this.save();
};

// Logic để điểm danh và kiểm tra không điểm danh hai lần trong cùng loại môn học
studentSchema.methods.markAttendance = async function (classId, subjectType, date) {
  const alreadyAttended = this.attendance.some(
    (a) => a.subjectType === subjectType && a.date.toDateString() === date.toDateString()
  );

  if (alreadyAttended) {
    throw new Error(`Học viên đã điểm danh cho môn ${subjectType} trong ngày ${date.toDateString()}.`);
  }

  this.attendance.push({ classId, subjectType, date });
  await this.save();
};

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;