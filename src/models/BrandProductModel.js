const mongoose = require("mongoose");

const productBrandSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: false },
    slug: { type: String, required: true, unique: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Liên kết với các sản phẩm
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model('BrandProduct', productBrandSchema);

module.exports = Brand;