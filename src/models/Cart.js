const mongoose = require("mongoose");
const cartSchema = mongoose.Schema(
  {
    cartId: {
      type: String,
    },
    info: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    size: String,
    color: String,
    quantity: Number,
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  
  },
  { timestamps: true }
);
const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
