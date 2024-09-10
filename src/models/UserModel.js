const mongoose = require("mongoose");

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
    slug: { type: String },
    isVerified: { type: Boolean, default: false },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;