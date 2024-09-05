const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productCollectionsSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		collection_id: {
			type: Number,
			required: true,
		},
		description: { type: String },

		image: { type: String,required: false },
		backgroundImage: { type: String, required: false }, 
		count: {
			type: Number,
			required: false,
		},
		slug: { type: String },
	},
	{
		timestamps: true,
	}
);

//Export the model
const Collections = mongoose.model('Collections',productCollectionsSchema);

module.exports = Collections;