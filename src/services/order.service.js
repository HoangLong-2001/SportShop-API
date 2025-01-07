const createHttpError = require("http-errors");
const Order = require("../models/Orders");
const {
  updateAnOrder,
  deleteAnOrder,
} = require("../controller/order.controller");

module.exports = {
  getAllOrderService: async () => {
    const orders = await Order.find({});
    if (!orders.length) {
      throw createHttpError.NotFound();
    }
    return orders;
  },
  updateAnOrderService: async (id, data) => {
    const order = await Order.findByIdAndUpdate(id, data, { new: true });
    if (!order) {
      throw createHttpError.NotFound();
    }
    return order;
  },
  deleteAnOrderService: async (id) => {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      throw createHttpError.NotFound();
    }
    return order;
  },
};
