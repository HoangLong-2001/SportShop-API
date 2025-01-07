const express = require("express");
const {
  postCreateAProduct,
  getAllProducts,
  getAProduct,
  deleteAProduct,
  updateAProduct,
} = require("../controller/product.controller");
const { createProductValidation } = require("../middlewares/validation");
const { verifyAccessToken } = require("../services/jwtService");
const { permission } = require("../middlewares/permission");
const router = express.Router();
router.post(
  "/",
  verifyAccessToken,
  permission,
  createProductValidation,
  postCreateAProduct
);
router.get("/", getAllProducts);
router.get("/:id", getAProduct);
router.delete("/:id", verifyAccessToken, permission, deleteAProduct);
router.put("/:id", verifyAccessToken, permission, updateAProduct);
module.exports = router;
