const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
	{
		name: { type: String,required: true,unique: true },
		image: [{ type: String,required: true }], // Mảng chứa nhiều hình ảnh
		type: { type: String,required: false },
		// category: { type: mongoose.Schema.Types.ObjectId,ref: "CategoryProduct",required: true },
		category: { type: Number,required: true },
		// brand: { type: mongoose.Schema.Types.ObjectId,ref: "BrandProduct",required: true },
		brand: { type: Number,required: true },
		price: { type: Number,required: true },
		fee: { type: Number,required: true },
		countInStock: { type: Number,required: true },
		rating: { type: Number,required: true },
		description: { type: String },
		discount: { type: Number },
		selled: { type: Number },
		slug: { type: String },
		collections: { type: Number,required: true }
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model('Product',productSchema);

module.exports = Product;
