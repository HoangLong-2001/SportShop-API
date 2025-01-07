const createHttpError = require("http-errors");

module.exports = {
  permission: (req, res, next) => {
    console.log(">>> Check payload:", req.payload);
    const { role } = req.payload;
    console.log(">>> check role:", role);
    if (role === "admin" || role === "staff") return next();
    return next(createHttpError.Forbidden("Không có quyền truy cập"));
  },
  adminPermission: (req, res, next) => {
    console.log(">>> Check payload:", req.payload);
    const { role } = req.payload;
    console.log(">>> check role:", role);
    if (role === "admin") return next();
    return next(createHttpError.Forbidden("Không có quyền truy cập"));
  },
};
