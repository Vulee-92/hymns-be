const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  add: { type: Boolean, default: false },
  view: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  export: { type: Boolean, default: false },
  print: { type: Boolean, default: false }
});

const featureSchema = new mongoose.Schema({
  // Tên của trang (menu)
  nameMenu: { type: String, required: true },
  
  // Icon đại diện cho trang
  icon: { type: String },
  
  // Thứ tự sắp xếp trang trong menu
  order: { type: Number },
  
  // ID phụ cho trang (có thể là mã nhận diện riêng)
  subId: { type: String },
  
  // Trang cha của trang này (nếu có)
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feature', default: null },
  
  // URL của trang
  url: { type: String, required: true, unique: true },
  
  // Trạng thái của trang (có thể là "active", "inactive" hoặc một trạng thái tùy chỉnh khác)
  stt: { type: String },
  
  // Phân quyền truy cập vào trang (CRUD và các quyền khác)
  permission: permissionSchema,

  // Hình ảnh đại diện cho trang (banner hoặc thumbnail)
  image: { type: String },
  
  // Mô tả về trang
  description: { type: String },
  
  // Phân loại trang (admin hoặc user)
  type: { type: String, enum: ['admin', 'user'], default: 'user' },
  
  // Trạng thái hoạt động của trang
  isActive: { type: Boolean, default: true },

  // Tự động thêm ngày tạo và cập nhật
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true }); // tự động thêm createdAt và updatedAt

// Tạo model Feature
const Feature = mongoose.model('Feature', featureSchema);

module.exports = Feature;
