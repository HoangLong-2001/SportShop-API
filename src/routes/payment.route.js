const express = require("express");
const {
  checkPaymentMethods,
  vnpayReturn,
  vnpayInput,
} = require("../controller/payment.controller");
const { verifyAccessToken } = require("../services/jwtService");
const { orderValidation } = require("../middlewares/validation");
const router = express.Router();
router.post("/",orderValidation, verifyAccessToken,checkPaymentMethods);
router.get('/vnpay_return',vnpayReturn)
router.get('/vnpay_ipn',vnpayInput)
module.exports = router;
