const mongoose = require('mongoose');

const RecentlyViewedSchema = new mongoose.Schema({
	userId: { type: String,required: true,index: true,unique: true,sparse: true },
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
			timestamp: { type: Date,default: Date.now },
		},
	],
});

const RecentlyViewed = mongoose.model('RecentlyViewed',RecentlyViewedSchema);

module.exports = RecentlyViewed;
