const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    mainImage: { type: String, required: true },
    image: [{ type: String, required: true }],
    type: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryProduct', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'BrandProduct', required: true },
    price: { type: Number, required: true },
    fee: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    description: { type: String },
    discount: { type: Number },
    discountPercentage: { type: Number },
    selled: { type: Number },
    slug: { type: String },
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collections' }], // Một sản phẩm có thể thuộc nhiều bộ sưu tập
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;