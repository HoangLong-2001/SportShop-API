const {
  getACustomerService,
  updateACustomerService,
  registerService,
} = require("../services/customer.service");
module.exports = {
  createACustomer:async(req,res,next)=>{
    try {
      const customer = await registerService(req.body);
      res.status(201).json({
        data: customer,
      });
    } catch (err) {
      next(err);
    }
  },
  getACustomer: async (req, res, next) => {
    const customerId = req.payload.userId;

    try {
      const customer = await getACustomerService(customerId);
      return res.status(200).json({
        data: customer,
        
      });
    } catch (err) {
      next(err);
    }
  },
  updateACustomer: async (req, res, next) => {
    console.log(">>> check update body:",req.body);
    const customerId = req.payload.userId;
    const type = req.payload.type;
    try {
      const customer = await updateACustomerService(customerId, req.body,type);
      return res.status(200).json({
        data: customer,
      });
    } catch (err) {
      next(err);
    }
  },
};
