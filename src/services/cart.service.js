const Cart = require("../models/Cart");
module.exports = {
  getCartService: async (customerId) => {
    const data = await Cart.find({ customerId }).populate({
      path: "info",
      model: "Product",
    });

    if (!data) {
      throw createError.NotFound();
    }
    return data;
  },
  addToCartService: async (customerId, data) => {
    const info = data.info._id;
    const { _id, quantity, color, size } = data;
    console.log(">>>Check cart's data:", data);
    const cart = await Cart.create({
      cartId: _id,
      info,
      quantity,
      color,
      size,
      customerId,
    });
    return cart;
  },
  updateCartService: async (customerId, data) => {
    console.log(">>>check update cart'data:", data);
    const cart = await Cart.updateOne(
      { cartId: data.cartId, customerId },
      { quantity: data.quantity }
    );
    console.log(">> check update:", cart);

    if (!cart) {
      throw createError.NotFound();
    }
    return cart;
  },
  deleteCartItemService: async (customerId, data) => {
    console.log(">>check delete data:", data);
    const cart = await Cart.deleteOne({ customerId, cartId: data._id });
    console.log(">>> check cart delete one:", cart);

    return cart;
  },
  deleteAllItemService: async (customerId) => {
    console.log(customerId);

    const cart = await Cart.deleteMany({ customerId });
    console.log(">>> check cart delete all:", cart);

    return [];
  },
};
