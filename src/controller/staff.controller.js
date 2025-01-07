const { getAllEmployeeService } = require("../services/employee.service");

module.exports = {
  getAllEmployee: async (req, res, next) => {
    try {
      const data = await getAllEmployeeService();
      return res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  },
};
