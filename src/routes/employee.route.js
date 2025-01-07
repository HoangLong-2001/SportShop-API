const express = require("express");
const { verifyAccessToken } = require("../services/jwtService");
const {
  getAnEmployee,
  updateAnEmployee,
  updatePasswordEmploy,
  createAnEmployee,
} = require("../controller/employee.controller");
const { updateAnEmployeeValidation,createAnEmployeeValid } = require("../middlewares/validation");
const { adminPermission } = require("../middlewares/permission");
const router = express.Router();
router.post("/",createAnEmployeeValid,createAnEmployee);
router.get("/", verifyAccessToken, getAnEmployee);
router.patch(
  "/",
  verifyAccessToken,
  updateAnEmployeeValidation,
  updateAnEmployee
);

router.patch("/password", verifyAccessToken, updatePasswordEmploy);
module.exports = router;
