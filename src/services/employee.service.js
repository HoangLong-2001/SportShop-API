const createHttpError = require("http-errors");
const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");
const sendEmail = require("../config/sendEmails");
const Login = require("../models/Login");
module.exports = {
  registerService: async (data) => {
    console.log("check register data", data);
    const checkEmail = await Employee.isEmailTaken(data.email);
    console.log(checkEmail);
    
    if (checkEmail) {
      throw createHttpError.BadGateway("Email is existed");
    }
    const password =  data["password"];
    const login = new Login({ ...data, type: "employee" });
    await login.save();
    delete data["password"]
    const emp = await Employee.create({ ...data, login: login._id });
    await sendEmail({
      to: data.email,
      subject: "Thông tin đăng nhập",
      message: `<p>
            Dưới đây là thông tin đăng nhập của bạn. Vui lòng không chia sẻ thông tin với bất kỳ ai và cập nhật lại mật khẩu.
            <br/>
            <br/>
            Email đăng nhập của bạn là: <strong>${data.email}</strong>
            <br/>
            Mật khẩu của bạn là: ${password}
            </p>`,
    });

    return emp;
  },
  getAnEmployeeService: async (employeeId) => {
    const emp = await Employee.findById(employeeId);
    if (!emp) throw createHttpError.NotFound();
    return emp;
  },
  updateAnEmployeeService: async (employeeId, data) => {
    console.log(">>>check data", employeeId, data);
    const emp = await Employee.updateOne({ _id: employeeId }, { ...data });
    if (!emp.acknowledged) {
      throw createHttpError.NotFound();
    }
    return emp;
  },
  updatePasswordService: async (employeeId, data) => {
    console.log(">>>check data:",  data);
    const emp = await Employee.findById(employeeId);
    const login = await Login.findOne({email:emp.email,type:"employee"})
    if (!emp) {
      throw createHttpError.NotFound();
    }
    const isValid = await bcrypt.compare(data.password, login.password);
    console.log(">>>check is valid", isValid);

    if (!isValid)
      throw createHttpError.Unauthorized("Mật khẩu đăng nhập không chính xác");
    login.password = data.newPassword;
    await login.save();
    return emp;
  },
  getAllEmployeeService: async () => {
    const data = await Employee.find({role:'staff'});
    return data;
  },
  deleteAnEmployeeService: async (id) => {
    const data = await Employee.findOneAndDelete({ _id: id });
    if (!data)
      throw createHttpError.NotFound("Không tìm thấy nhân viên trong CSDL");
    return data;
  },
};
