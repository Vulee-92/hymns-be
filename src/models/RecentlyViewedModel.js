const mongoose = require('mongoose');

const RecentlyViewedSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    index: true, 
    unique: true 
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String },
      image: [{ type: String }],
      price: { type: Number },
      slug: { type: String },
      countInStock: { type: Number },
      timestamp: { type: Date, default: Date.now },
      viewCount: { type: Number, default: 1 },
      isDeleted: { type: Boolean, default: false }
    },
  ],
}, { timestamps: true });

const RecentlyViewed = mongoose.model('RecentlyViewed', RecentlyViewedSchema);

module.exports = RecentlyViewed;