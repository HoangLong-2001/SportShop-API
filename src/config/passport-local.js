const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Login = require("../models/Login");
const bcrypt = require("bcrypt");
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      console.log(">>> check email, password and type:", {
        email,
        password,
        type: req.body.type,
      });

      try {
        const login = await Login.findOne({ email, type: req.body.type });
        console.log(">>> check login:", login);
        if (!login) {
          return done(new Error("Sai email đăng nhập"), false);
        }
        console.log(">>> check password in database", login.password);
        const check = await bcrypt.compare(password, login.password);
        console.log(">>>check password:", check);

        if (!check) {
          return done(new Error("Sai mật khẩu đăng nhập"), false);
        }
        return done(null, login);
      } catch (error) {
        console.log(">>> check error:", error);

        done(error, false);
      }
    }
  )
);
passport.serializeUser((login, done) => {
  done(null, login);
});
passport.deserializeUser(async (login, done) => {
  try {
    const signIn = await Login.findOne({ _id: login._id });

    if (signIn) return done(null, login);
    done(null, false);
  } catch (error) {
    done(error, false);
  }
});
module.exports = passport;
