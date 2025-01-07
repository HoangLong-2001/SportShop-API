const Employee = require("../models/Employee");
const {
  getAnEmployeeService,
  updateAnEmployeeService,
  updatePasswordService,
  getAllEmployeeService,
  deleteAnEmployeeService,
  registerService,
} = require("../services/employee.service");

module.exports = {
  createAnEmployee: async (req, res, next) => {
    const data = req.body;
    try {
      const employee = await registerService(data);
      return res.status(201).json({
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  },
  getAnEmployee: async (req, res, next) => {
    const employeeId = req.payload.userId;
    try {
      const emp = await getAnEmployeeService(employeeId);
      return res.status(200).json({
        data: emp,
      });
    } catch (error) {
      next(error);
    }
  },
  updateAnEmployee: async (req, res, next) => {
    const employeeId = req.payload.userId;
    try {
      const emp = await updateAnEmployeeService(employeeId, req.body);
      return res.status(201).json({ data: emp });
    } catch (error) {
      next(error);
    }
  },
  updateAnEmployeeById: async (req, res, next) => {
    const employeeId = req.params.id;
    try {
      const emp = await updateAnEmployeeService(employeeId, req.body);
      return res.status(201).json({ data: emp });
    } catch (error) {
      next(error);
    }
  },
  updatePasswordEmploy: async (req, res, next) => {
    const employeeId = req.payload.userId;
    console.log(">>>check employeeId:", employeeId);

    try {
      const emp = await updatePasswordService(employeeId, req.body);
      return res.status(201).json({ data: emp });
    } catch (error) {
      next(error);
    }
  },
  getAllEmployee: async (req, res, next) => {
    try {
      const data = await getAllEmployeeService();
      return res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  },
  deleteAnEmployee: async (req, res, next) => {
    console.log("check id", req.params.id);
    try {
      const data = await deleteAnEmployeeService(req.params.id);
      return res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  },
};
