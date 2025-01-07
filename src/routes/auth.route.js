const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const passport_local = require("../config/passport-local");
const {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
} = require("../services/jwtService");
const {loginToAccount, refreshToken, logOutAccount, forgotPassword, googleAuth} = require('../controller/auth.controller')
const {
  loginValidation,
  forgotPasswordValidation,
} = require("../middlewares/validation");
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:8080/auth/google/success",
    failureRedirect: "http://localhost:8080/auth/google/failed",
  })
);
router.get("/google/success", googleAuth);
router.get("/google/failed", (req, res) => {
  req.logOut(() => {
    res.clearCookie("connect.sid");
  });
  res.redirect("http://localhost:3000/");
});
// );
router.post('/login',loginValidation,passport_local.authenticate("local", { session: false }),loginToAccount)
router.post('/refreshToken',refreshToken)
router.post('/logout',verifyAccessToken,logOutAccount)
router.patch("/forgotPassword",forgotPasswordValidation,forgotPassword)
module.exports = router;
