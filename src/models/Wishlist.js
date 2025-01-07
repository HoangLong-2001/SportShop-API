const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema(
  {
    product: { type: String, ref: "Product" , unique: true},
    customerId: { type: String, ref: "Customer" },
  },
  { timestamps: true }
);
const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
