const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['counter', 'cod', 'bank_transfer'], 
    required: true 
  },
  bankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    accountHolderName: { type: String }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);
module.exports = PaymentMethod;