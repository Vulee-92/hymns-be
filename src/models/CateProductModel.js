const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productCategorySchema = new mongoose.Schema(
	{
		category: {
			type: String,
			required: true,
		},
		cate_id: {
			type: Number,
			required: true,
		},
		count: {
			type: Number,
			required: true,
			default: 0
		},
		slug: { type: String },
		image: { type: String,required: true }, // Mảng chứa nhiều hình ảnh

		type: { type: Number },
		products: [{ type: mongoose.Schema.Types.ObjectId,ref: 'Product',required: false }]


	},
	{
		timestamps: true,
	}
);

const Category = mongoose.model('CategoryProduct',productCategorySchema);

module.exports = Category;

//Export the model
