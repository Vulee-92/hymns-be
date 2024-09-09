const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productBrandSchema = new mongoose.Schema(
	{
		brand: {
			type: String,
			required: true,
		},
		brand_id: {
			type: Number,
			required: true,
		},
		count: {
			type: Number,
			required: true,
			default: 0
		},
		description: { type: String },
		image: { type: String,required: false }, // Mảng chứa nhiều hình ảnh

		slug: { type: String },
		type: { type: Number }, // 2 cho category
		products: [{ type: mongoose.Schema.Types.ObjectId,ref: 'Product',required: false }]
	},
	{
		timestamps: true,
	}
);

//Export the model
const Brand = mongoose.model('BrandProduct',productBrandSchema);

module.exports = Brand;