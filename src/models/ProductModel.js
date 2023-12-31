const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
	{
		name: { type: String,required: true,unique: true },
		image: [{ type: String,required: true }], // Mảng chứa nhiều hình ảnh
		type: { type: String,required: true },
		price: { type: Number,required: true },
		fee: { type: Number,required: true },
		countInStock: { type: Number,required: true },
		rating: { type: Number,required: true },
		description: { type: String },
		discount: { type: Number },
		selled: { type: Number },
		slug: { type: String },
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model('Product',productSchema);

module.exports = Product;
