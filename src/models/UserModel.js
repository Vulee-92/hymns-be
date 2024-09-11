const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
	fullName: { type: String,required: true },
	phone: { type: String,required: true },
	email: { type: String,required: true },
	address: { type: String,required: true },
	city: { type: String,required: true },
	province: { type: String,required: true },
	ward: { type: String,required: true },
	isDefault: { type: Boolean,default: false }, // Thêm trường này
},{ _id: true });
const userSchema = new mongoose.Schema(
	{
		name: { type: String },
		email: { type: String,required: true,unique: true,index: true },
		password: { type: String,required: true },
		isAdmin: { type: Boolean,default: false,required: true },
		phone: { type: String },
		address: { type: String },
		avatar: { type: String },
		verificationCode: { type: Number },
		verificationCodeExpires: { type: Date },
		lastName: { type: String },
		city: { type: String },
		province: { type: String },
		ward: { type: String },
		// Thêm trường này vào UserSchema
		roleId: { type: mongoose.Schema.Types.ObjectId,ref: 'Role' },
		slug: { type: String },
		isVerified: { type: Boolean,default: false },
		cart: { type: mongoose.Schema.Types.ObjectId,ref: 'Cart' },
		shippingAddresses: [addressSchema], // Mảng lưu trữ nhiều địa chỉ giao hàng
		defaultShippingAddress: addressSchema // Địa chỉ giao hàng mặc định
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User",userSchema);
module.exports = User;