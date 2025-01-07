const createHttpError = require("http-errors");
const Otp = require("../models/Otp");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("./jwtService");
const Login = require("../models/Login");
const Customer = require("../models/Customers");
const Employee = require("../models/Employee");

module.exports = {
  loginService: async ({ email, type }) => {
    let user;
    if (type === "customer") {
      user = await Customer.findOne({ email });
    } else if (type === "employee") {
      user = await Employee.findOne({ email });
    }

    if (!user)
      throw createHttpError.NotFound(
        "Email hoặc mật khẩu không đúng vui lòng thử lại"
      );
    console.log(">>> check user:", user);

    const accessToken = await signAccessToken({ userId: user._id, role:user.role, type});
    const refreshToken = await signRefreshToken({
      userId: user._id,
      email,
      type,
    });
    return {
      accessToken,
      refreshToken,
      role:user.role
    };
  },
  refreshTokenService: async ({refreshToken,role}) => {
    // console.log(">>> check refresh token:", refreshToken);
    // console.log(">>> check role:", role);
    if (!refreshToken) throw createHttpError.BadRequest();
    const payload = await verifyRefreshToken(refreshToken);
    const accessToken = await signAccessToken({...payload,role});
    // console.log(">>> check new access token:", accessToken);
    
    return { accessToken };
  },
  logOutService: async (userId, type) => {
    console.log(userId, type);

    let user;
    if (type === "customer") {
      user = await Customer.findById(userId).populate("login");
    } else if (type === "employee") {
      user = await Employee.findById(userId).populate("login");
    }
    console.log("check logut user:", user);

    if (!user)
      throw createHttpError.Unauthorized("Không thể xác thực");
    return user;
  },
  forgotPasswordService: async ({ email, password, type, otp }) => {
    const OTP = await Otp.findOne({ email, otp });

    if (!OTP.verify || !OTP) {
      throw createHttpError.BadRequest("OTP is not verified");
    }
    const login = await Login.findOne({ email, type });
    if (!login) throw createHttpError.NotFound("Customer is not exist");
    login.password = password;
    await login.save();
    return login;
  },
};
