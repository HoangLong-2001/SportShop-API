const mongoose = require("mongoose");
var mongoose_delete = require("mongoose-delete");
const reviewSchema = new mongoose.Schema({
  rating: { type: Number, default: 0 },
  comment: String,
  date: { type: Date, default: Date.now },
  reviewName: { type: String, required: true },
  reviewEmail: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: { type: String, uppercase: true },
    brand: { type: String, uppercase: true },
    tags: [{ type: String, uppercase: true }],
    sports: [{ type: String, uppercase: true }],
    genders: [{ type: String, uppercase: true }],
    sizes: [{ type: String, uppercase: true }],
    colors: [{ type: String, uppercase: true }],
    images: [String],
    price: { type: Number, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 1 },
    stock: { type: Number, default: 0, min: 0 },
    rate: { type: Number, default: 0 },
    newArrival: { type: Boolean, default: false },
    reviews: [reviewSchema],
    discountPrice: {
      type: Number,
      default: function () {
        return this.price - this.discount * this.price;
      },
    },
  },
  { timestamps: true }
);
productSchema.statics.updateQuantity = async function (item) {
  const product = await this.findOne({ _id: item.product_id });
  product.stock = product.stock - item.quantity;
  await product.save();
};
const Products = mongoose.model("Product", productSchema);

module.exports = Products;
