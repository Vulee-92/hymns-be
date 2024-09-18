const mongoose = require('mongoose');

// Định nghĩa schema cho vận chuyển
const shippingSchema = new mongoose.Schema({
  // ID của đơn hàng liên quan
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  // Số theo dõi vận chuyển
  trackingNumber: { 
    type: String, 
    required: true 
  },
  // Nhà vận chuyển
  carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier', required: true }, // Tham chiếu đến Carrier
  // Trạng thái vận chuyển
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  // Ngày dự kiến giao hàng
  estimatedDeliveryDate: { 
    type: Date 
  },
  // Ngày thực tế giao hàng
  actualDeliveryDate: { 
    type: Date 
  },
  // Địa chỉ giao hàng
  shippingAddress: {
    street: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    state: { 
      type: String, 
      required: true 
    },
    postalCode: { 
      type: String, 
      required: true 
    },
    country: { 
      type: String, 
      required: true 
    }
  },
  isDeleted: { type: Boolean, default: false }
}, {
  // Tự động thêm các trường `createdAt` và `updatedAt`
  timestamps: true
});

// Tạo mô hình `Shipping` từ schema
const Shipping = mongoose.model('Shipping', shippingSchema);

// Xuất mô hình để sử dụng trong các phần khác của ứng dụng
module.exports = Shipping;