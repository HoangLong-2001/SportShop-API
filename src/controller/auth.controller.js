const Login = require("../models/Login");
const {
  loginService,
  refreshTokenService,
  logOutService,
  forgotPasswordService,
} = require("../services/auth.service");
const { signAccessToken, signRefreshToken } = require("../services/jwtService");

module.exports = {
  loginToAccount: async (req, res, next) => {
    console.log("login body:", req.body);

    try {
      const tokens = await loginService(req.body);
      return res.status(200).json({
        ...tokens,
      });
    } catch (err) {
      next(err);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const tokens = await refreshTokenService(req.body);
      return res.status(200).json({
        ...tokens,
      });
    } catch (err) {
      next(err);
    }
  },
  logOutAccount: async (req, res, next) => {
    const userId = req.payload.userId;
    const type = req.payload.type;
    try {
      const result = await logOutService(userId, type);
      res.clearCookie("connect.sid");
      res.clearCookie("expireT");
      return res.status(200).json({
        result,
      });
    } catch (err) {
      next(err);
    }
  },
  forgotPassword: async (req, res, next) => {
    const { email, password, otp, type } = req.body;
    try {
      const result = await forgotPasswordService({
        email,
        password,
        otp,
        type,
      });
      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
  googleAuth: async (req, res, next) => {
    try {
      console.log("check auth", req.isAuthenticated());
      if (!req.isAuthenticated()) throw createHttpError.Unauthorized();

      const accessToken = await signAccessToken({
        userId: req.user._id,
        email: req.user.email,
        type: req.user.type,
      });
      console.log(">>> check access-token", accessToken);

      const refreshToken = await signRefreshToken({
        userId: req.user._id,
        email: req.user.email,
        type: req.user.type,
      });
      console.log(">>> check refresh-token", refreshToken);
      const login = await Login.findOne({
        email: req.user.email,
        type: "customer",
      });
      if (!login) {
        await Login.create({
          email: req.user.email,
          type: "customer",
          token: refreshToken,
        });
      } else {
        await Login.findOneAndUpdate(
          { email: req.user.email, type: "customer" },
          { token: refreshToken }
        );
      }
      res.cookie("accessToken", accessToken, {
        maxAge: 10 * 60 * 1000,
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 120 * 60 * 1000,
        secure: true,
      });
      res.cookie("expireT", Date.now(), {
        maxAge: 10 * 60 * 1000,
        secure: true,
      });
      res.redirect("http://localhost:3000");
    } catch (err) {
      console.log(err);

      res.redirect("http://localhost:8080/auth/google/failed");
      next(err);
    }
  },
};
