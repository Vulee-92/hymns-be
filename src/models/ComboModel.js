const mongoose = require('mongoose');

const comboSchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 }
  }],
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collections' }],
  brand: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BrandProduct' }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CategoryProduct' }],
  totalOriginalPrice: { type: Number, required: true },
  comboPrice: { type: Number, required: true },
  discountPercentage: { type: Number },
  mainImage: { type: String, required: true },
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  description: { type: String },
  selled: { type: Number, default: 0 },
  slug: { type: String, required: true, unique: true },
  countInStock: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

comboSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('totalOriginalPrice') || this.isModified('comboPrice')) {
    this.discountPercentage = ((this.totalOriginalPrice - this.comboPrice) / this.totalOriginalPrice) * 100;
  }
  next();
});

const Combo = mongoose.model('Combo', comboSchema);
module.exports = Combo;