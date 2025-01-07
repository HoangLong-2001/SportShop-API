const { getAllOrderService, deleteAnOrderService, updateAnOrderService } = require("../services/order.service");

module.exports = {
  getAllOrders: async (req, res, next) => {
    try {
      const result = await getAllOrderService();
      return res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  },
  updateAnOrder: async (req, res, next) => {
    try {
      const result = await updateAnOrderService(req.params.id, req.body);
      return res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  },
  deleteAnOrder: async (req, res, next) => {
    try {
      const result = await deleteAnOrderService(req.params.id);
      return res.status(200).json({ data: result });
    } catch (error) {
        next(error);
    }
  },
};
