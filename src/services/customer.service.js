const Customer = require("../models/Customers");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("./jwtService");
const Token = require("../models/Token");
const Otp = require("../models/Otp");
const Login = require("../models/Login");
module.exports = {
  registerService: async (data) => {
    const checkExitsEmail = await Customer.isEmailTaken(data.email);
    if (checkExitsEmail) {
      throw createError.BadRequest("Email đã tồn tại");
    }
    const login = new Login({ ...data, type: "customer" });
    await login.save();
    delete data["password"];
    const customer = new Customer({
      ...data,
      login: login._id,
    });
    await customer.save();
    return customer;
  },
  getACustomerService: async (customerID) => {
    const customer = await Customer.findById(customerID).populate("login");
    if (!customer)
      throw createError.NotFound("Không tìm thấy thông tin khách hàng");
    
    const isPassword = customer.login.password ? true : false;
    delete customer.login;
    return {...customer._doc, isPassword };
  },
  updateACustomerService: async (customerId, data, type) => {
    console.log("check data:", data);

    let customer = await Customer.findById(customerId);
    let login = await Login.findOne({ email: customer.email, type });
    console.log(">>> Check Customer:", login);
    // check exited email
    if (data.email) {
      if (await Customer.findOne({ email: data.email }))
        throw createError.BadRequest("Email đã tồn tại");
    }
    if (!customer) throw createError.NotFound();
    //check existed password
    if (login?.password && data.password) {
      const isValid = await bcrypt.compare(data.password, customer.password);
      if (!isValid) throw createError.Unauthorized("Sai mật khẩu");
      data.password = data["confirm__password"];
      delete data["confirm__password"];
      login.password = data.password;
      delete data.password;
      await login.save();
    }
    // check new password
    if (data.confirm__password && !login.password) {
      data.password = data["confirm__password"];
      login.password = data.password;
      delete data["confirm__password"];
      delete data.password;
      await login.save();
    }

    customer = await Customer.updateOne({ _id: customerId }, data);
    if (!customer.acknowledged)
      throw createError.BadGateway("Cập nhật không thành công");
    return customer;
  },
  // Forgot password
  forgotPasswordService: async ({ email, password, otp }) => {
    const OTP = await Otp.findOne({ email, otp });

    if (!OTP.verify || !OTP) {
      throw createError.BadRequest("OTP is not verified");
    }
    const customer = await Customer.findOne({ email });
    if (!customer) throw createError.NotFound("Customer is not exist");
    customer.password = password;
    await customer.save();
    return customer;
  },
};
