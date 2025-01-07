const express = require("express");
const { verifyAccessToken } = require("../services/jwtService");
const { adminPermission } = require("../middlewares/permission");
const { getAllEmployee, deleteAnEmployee, updateAnEmployeeById } = require("../controller/employee.controller");
const { updateAnEmployeeValidation } = require("../middlewares/validation");
const router = express.Router();

router.get("/", verifyAccessToken, adminPermission, getAllEmployee);
router.delete("/:id", verifyAccessToken, adminPermission,deleteAnEmployee);
router.put(
    "/:id",
    verifyAccessToken,
    adminPermission,
    updateAnEmployeeValidation,
    updateAnEmployeeById
  );
module.exports = router;
