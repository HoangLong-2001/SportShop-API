const express = require("express");
const router = express.Router();
const orderRoute = require("./order.route");
const productRoute = require("./product.route");
const customerRoute = require("./customer.route");
const employRoute = require("./employee.route");
const authRoute = require("./auth.route");
const cartRoute = require("./cart.route");
const staffRoute = require("./staff.route");
const paymentRoute = require("./payment.route");
const wishlistRoute = require("./wishlist.route");
const otpRoute = require('./otp.route')
router.use("/cart", cartRoute);
router.use("/auth", authRoute);
router.use("/order", orderRoute);
router.use("/products", productRoute);
router.use("/customer", customerRoute);
router.use("/employee", employRoute);
router.use("/staff", staffRoute);
router.use("/payment", paymentRoute);
router.use("/wishlist", wishlistRoute);
router.use('/otp',otpRoute)
module.exports = router;
