const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Liên kết với các sản phẩm
    isDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('CategoryProduct', productCategorySchema);

module.exports = Category;