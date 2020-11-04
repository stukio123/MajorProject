const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    tel: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    cart: Object,
    status: {
      type: String,
      enum: ["Chưa Thanh Toán", "Đã Giao Hàng", "Đã Thanh Toán"],
      default: "Chưa Thanh Toán",
    },
    totalPrice: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", cartSchema);
