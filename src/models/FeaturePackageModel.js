const mongoose = require('mongoose');

const featurePackageSchema = new mongoose.Schema({
  // Tên gói chức năng
  name: { type: String, required: true, unique: true },
  
  // Mã gói chức năng
  code: { type: String, required: true, unique: true },

  // Các chức năng thuộc gói này và quyền truy cập
  features: [{
    feature: { type: mongoose.Schema.Types.ObjectId, ref: 'Feature' },
    access: { type: Boolean, default: false }
  }],

  // Giá tiền của gói (ví dụ: 10000, 20000)
  price: { type: Number, required: true, default: 0 },

  // Thời hạn sử dụng của gói (đơn vị: ngày)
  duration: { type: Number, required: true, default: 30 }, // 30 ngày chẳng hạn

  // Mô tả về gói chức năng
  description: { type: String },

  // Trạng thái gói: active, inactive
  status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },  
  isDeleted: { type: Boolean, default: false },

  // Tự động thêm ngày tạo và ngày cập nhật
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true }); // tự động thêm createdAt và updatedAt

// Tạo model FeaturePackage
const FeaturePackage = mongoose.model('FeaturePackage', featurePackageSchema);

module.exports = FeaturePackage;
