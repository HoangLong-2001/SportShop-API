const express = require("express");
const {
  getACustomer,
  updateACustomer,
  createACustomer,
} = require("../controller/customer.controller");
const {
  registerValidation,
} = require("../middlewares/validation");
const { updateACustomerValidation } = require("../middlewares/validation");
const { verifyAccessToken } = require("../services/jwtService");
const router = express.Router();
router.get("/", verifyAccessToken, getACustomer);
router.post("/", registerValidation,createACustomer);
router.put("/", verifyAccessToken, updateACustomerValidation, updateACustomer);
module.exports = router;
