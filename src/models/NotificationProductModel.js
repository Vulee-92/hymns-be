const mongoose = require('mongoose');

const notificationProductSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  notified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('NotificationProduct', notificationProductSchema);