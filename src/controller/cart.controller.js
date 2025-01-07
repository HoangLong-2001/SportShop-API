const {
  getCartService,
  addToCartService,
  updateCartService,
  deleteCartItemService,
  deleteAllItemService,
} = require("../services/cart.service");

module.exports = {
  getCart: async (req, res, next) => {
    const customerId = req.payload.userId;
    console.log(">>> Check id", customerId);

    try {
      const data = await getCartService(customerId);
      console.log(">>>check cartList:", data);

      return res.status(200).json({
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
  addToCart: async (req, res, next) => {
    const customerId = req.payload.userId;

    try {
      const customer = await addToCartService(customerId, req.body);
      return res.status(200).json({
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  },
  updateCart: async (req, res, next) => {
    const customerId = req.payload.userId;
    try {
      const data = await updateCartService(customerId, req.body);
      return res.status(200).json({
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteCartItem: async (req, res, next) => {
    const customerId = req.payload.userId;
    try {
      const data = await deleteCartItemService(customerId, req.body);
      return res.status(200).json({
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteAllItem: async (req, res, next) => {
    const customerId = req.payload.userId;
    try {
      const data = await deleteAllItemService(customerId);
      return res.status(200).json({
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
