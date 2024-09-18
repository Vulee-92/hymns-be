const mongoose = require("mongoose");

const productCollectionsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: false },
    backgroundImage: { type: String, required: false },
    slug: { type: String, required: true, unique: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Liên kết với các sản phẩm
    isDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

const Collections = mongoose.model('Collections', productCollectionsSchema);

module.exports = Collections;