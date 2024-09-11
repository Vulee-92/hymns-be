const mongoose = require('mongoose');

// Định nghĩa schema cho nhà vận chuyển
const carrierSchema = new mongoose.Schema({
  // Tên của nhà vận chuyển
  name: { 
    type: String, 
    required: true, // Bắt buộc phải có
    unique: true // Tên phải là duy nhất
  },
  // Thông tin liên hệ của nhà vận chuyển
  contactInfo: {
    // Số điện thoại liên hệ
    phone: { 
      type: String, 
      required: true // Bắt buộc phải có
    },
    // Email liên hệ
    email: { 
      type: String, 
      required: true // Bắt buộc phải có
    },
    // Địa chỉ liên hệ
    address: {
      // Đường
      street: { 
        type: String, 
        required: true // Bắt buộc phải có
      },
      // Thành phố
      city: { 
        type: String, 
        required: true // Bắt buộc phải có
      },
      // Bang hoặc tỉnh
      state: { 
        type: String, 
        required: true // Bắt buộc phải có
      },
      // Mã bưu điện
      postalCode: { 
        type: String, 
        required: true // Bắt buộc phải có
      },
      // Quốc gia
      country: { 
        type: String, 
        required: true // Bắt buộc phải có
      }
    }
  },
  // Trạng thái hoạt động của nhà vận chuyển
  isActive: { 
    type: Boolean, 
    default: true // Mặc định là hoạt động
  }
}, {
  // Tự động thêm các trường `createdAt` và `updatedAt`
  timestamps: true
});

// Tạo mô hình `Carrier` từ schema
const Carrier = mongoose.model('Carrier', carrierSchema);

// Xuất mô hình để sử dụng trong các phần khác của ứng dụng
module.exports = Carrier;