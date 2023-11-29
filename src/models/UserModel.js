const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
	{
		name: { type: String },
		email: { type: String,required: true,unique: true },
		password: { type: String,required: true },
		isAdmin: { type: Boolean,default: false,required: true },
		phone: { type: String },
		address: { type: String },
		avatar: { type: String },
		verificationCode: { type: Number },
		lastName: { type: String },
		city: { type: String },
		province: { type: String },
		ward: { type: String },
		slug: { type: String },
		isVerified: { type: Boolean,default: false }
	},
	{
		timestamps: true,
	}
);
const User = mongoose.model("User",userSchema);
module.exports = User;
