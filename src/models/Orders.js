const mongoose = require("mongoose");
const itemSchema = mongoose.Schema(
  {
    product_id: { type: String, ref: "product" },
    price: Number,
    size: String,
    color: String,
    quantity: Number,
  },
  { timestamps: true }
);
const orderSchema = mongoose.Schema(
  {
    order_detail: [itemSchema],
    customerId: { type: String, ref: "customer" },
    customer_name: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    address: String,
    phoneNumber: String,
    email:String,
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    // shippingDate: { type: Date },
    // deliveryDate: { type: Date }
  },
  { timestamps: true }
);
const Order = mongoose.model("order", orderSchema);
module.exports = Order;
