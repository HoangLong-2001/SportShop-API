const express = require("express");
const { verifyAccessToken } = require("../services/jwtService");
const {
  getCart,
  addToCart,
  updateCart,
  deleteCartItem,
  deleteAllItem,
} = require("../controller/cart.controller");
const router = express.Router();
router.get("/", verifyAccessToken, getCart);
router.post("/", verifyAccessToken, addToCart);
router.put("/", verifyAccessToken, updateCart);
router.delete("/", verifyAccessToken,deleteAllItem);
router.delete("/:id", verifyAccessToken, deleteCartItem);
module.exports = router;
