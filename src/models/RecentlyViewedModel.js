// models/recentlyViewed.js
const mongoose = require('mongoose');

const RecentlyViewedSchema = new mongoose.Schema({
	userId: { type: String },// Định danh người dùng (có thể là ID của người dùng nếu có hệ thống đăng nhập)
	products: [
		{
			productId: { type: String },
			name: { type: String,require: true,index: true,unique: true,sparse: true },
			image: [{ type: String }],
			price: { type: Number },
			slug: { type: String },
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			timestamp: { type: Date,default: Date.now },
		},
	],
});

const RecentlyViewed = mongoose.model('RecentlyViewed',RecentlyViewedSchema);

module.exports = RecentlyViewed;
