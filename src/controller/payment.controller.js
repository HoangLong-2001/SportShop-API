const createHttpError = require("http-errors");
const {
  cashPaymentService,
  vnpayPaymentService,
  vnpayInputService,
  vnpayReturnService,
} = require("../services/payment.serivce");
const vnpayPayment = async (req, res, next) => {
  const customerId = req.payload.userId;
  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  try {
    const vnpUrl = await vnpayPaymentService(ipAddr, customerId, req.body);
    return res.status(200).json({
      message: "redirect",
      url: vnpUrl,
    });
  } catch (error) {
    next(error);
  }
};
const cashPayment = async (req, res, next) => {
  const customerId = req.payload.userId;
  try {
    const order = await cashPaymentService(customerId, req.body);
    res.status(200).json({
      message: "success",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
const checkPaymentMethods = async function (req, res, next) {
  const method = req.body.payment_method;

  try {
    switch (method) {
      case "cash":
        return await cashPayment(req, res, next);
      case "vnpay":
        return await vnpayPayment(req, res, next);
      default:
        throw createHttpError.BadRequest("");
    }
  } catch (error) {
    next(error);
  }
};
const vnpayReturn = async (req, res, next) => {
  const vnp_Params = req.query;
  try {
    const result = await vnpayReturnService(vnp_Params);
    if (result.status.RspCode === "00") {
      res.redirect("http://localhost:3000/success");
    } else {
      res.redirect("http://localhost:3000");
    }
   
  } catch (error) {
    next(error);
  }
};
const vnpayInput = async (req, res, next) => {
  console.log("check input url");
  const vnp_Params = req.query;
  try {
    const result = await vnpayInputService(vnp_Params);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkPaymentMethods,
  vnpayReturn,
  vnpayInput,
};
