require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Customer = require("../models/Customers");
const Login = require("../models/Login");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://sportshop-api.onrender.com/auth/google/callback",
    },
    async function (_, _, profile, cb) {
      try {
        let customer = await Customer.findOne({
          email: profile.emails[0].value,
        });

        if (!customer) {
          const login = await Login.create({email: profile.emails[0].value, type: "customer"});
          customer = await Customer.create({
            email: profile.emails[0].value,
            name: profile.name.familyName + " " + profile.name.givenName,
            login: login._id,
          });
        }
        return cb(null, {
          _id: customer._id,
          email: customer.email,
          type: "customer",
        });
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(async (user, done) => {
  try {
    const customer = await Customer.findOne({ _id: user._id });
    if (customer) return done(null, user);
    done(null, null);
  } catch (error) {
    done(error, null);
  }
});
module.exports = passport;
