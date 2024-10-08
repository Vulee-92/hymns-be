const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	phone: { type: String, required: true },
	email: { type: String, required: true },
	address: { type: String, required: true },
	city: { type: String, required: true },
	province: { type: String, required: true },
	ward: { type: String, required: true },
	isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema(
	{
		name: { type: String },
		email: { type: String, required: true, unique: true, index: true },
		password: { type: String, required: true },
		isAdmin: { type: Boolean, default: false, required: true },
		phone: { type: String },
		address: { type: String },
		avatar: { type: String },
		verificationCode: { type: Number },
		verificationCodeExpires: { type: Date },
		lastName: { type: String },
		city: { type: String },
		province: { type: String },
		ward: { type: String },
		role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
		featurePackage: { type: mongoose.Schema.Types.ObjectId, ref: 'FeaturePackage' },
		slug: { type: String },
		isVerified: { type: Boolean, default: false },
		cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
		shippingAddresses: [addressSchema],
		defaultShippingAddress: { type: mongoose.Schema.Types.ObjectId },
		following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		isDeleted: { type: Boolean, default: false }
	},
	{
		timestamps: true,
	}
);

// Thêm virtual fields để liên kết với Teacher hoặc Student
userSchema.virtual('teacherProfile', {
  ref: 'Teacher',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

userSchema.virtual('studentProfile', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;