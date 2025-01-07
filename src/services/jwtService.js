const JWT = require("jsonwebtoken");
const createErr = require("http-errors");
const Token = require("../models/Token");
const Login = require("../models/Login");
require("dotenv").config();
const signAccessToken = async ({ userId, role, type }) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
      role,
      type,
    };
    // console.log(">>> check payload new:", payload);
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "10m",
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};
const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return next(createErr.Unauthorized());
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {  
    if (err) {
      if (err.name === "JsonWebTokenError")
        return next(createErr.Unauthorized());
      return next(createErr.Unauthorized(err.message));
    }
    req.payload = payload;
    next();
  });
};
const verifyRefreshToken = async (refreshToken, type) => {
  return new Promise((res, rej) => {
    JWT.verify(
      refreshToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, payload) => {
        if (err) {
          return rej(err);
        }
        const ref_token = await Login.findOne({
          email: payload.email,
          type: payload.type,
        });
        if (!ref_token) {
          return rej(createErr.InternalServerError());
        }
        if (refreshToken === ref_token.token) {
          res(payload);
        } else {
          return rej(createErr.Unauthorized());
        }
      }
    );
  });
};
const signRefreshToken = async ({ userId, email, type }) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
      email,
      type,
    };

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "120m",
    };
    JWT.sign(payload, secret, options, async (err, token) => {
      if (err) return reject(err);
      // try {
      //   // const refToken = await Token.create({
      //   //   token,
      //   //   customerId: userId,
      //   //   time: options.expiresIn,
      //   // });
      //   const login = await Login.findOne({email,type})
      //   if(login) throw Error('Đã tồn tai')
      //   if (!refToken) {
      //     return reject(createErr.InternalServerError());
      //   }
      //   return resolve(token);
      // } catch (err) {
      //   const refToken = await Token.findOne({ customerId: userId });

      //   if (!refToken) return reject(createErr.NotFound());

      //   refToken.token = token;
      //   await refToken.save();
      //   return resolve(token);
      // }
      let login = await Login.findOne({ email, type })
      if(!login){
        login = await Login.create({ email, type })
      }else{
        login = await Login.updateOne({ email, type }, { token: token });
        if (!login.matchedCount) {
          return reject(createErr.NotFound());
        }
      }
    
      return resolve(token);
    });
  });
};
module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
