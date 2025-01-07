const mongoose = require("mongoose");
const otpSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    email: true,
  },
  otp: {
    type: String,
    required: true,
    max: 4,
  },
  verify:{type:Boolean,default:false}
});
const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
