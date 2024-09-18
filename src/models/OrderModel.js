const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        image: [{ type: String, required: true }],
        price: { type: Number, required: true },
        fee: { type: Number, required: false },
        slug: { type: String, required: true },
        discount: { type: Number },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
          index: true
        },
      },
    ],
    // Tham chiếu trực tiếp đến ShippingModel cho địa chỉ giao hàng
    shippingAddress: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Shipping', 
      required: true 
    },
    paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
    shippingMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    orderStatus: { 
      type: String, 
      enum: ["pending", "shipped", "delivered", "cancelled"], 
      default: "pending" 
    },
    codeOrder: { type: String },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    qrCode: { type: String },
    shipping: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipping' }, // Tham chiếu đến Shipping
    isDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;