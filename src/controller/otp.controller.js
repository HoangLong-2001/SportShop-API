const Otp = require("../models/Otp.js");
const randomstring = require("randomstring");
const sendEmail = require("../config/sendEmails.js");
const createHttpError = require("http-errors");

// Generate OTP
function generateOTP() {
  return randomstring.generate({
    length: 4,
    charset: "numeric",
  });
}

// Send OTP to the provided email
exports.sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);

    const otp = generateOTP(); // Generate a 4-digit OTP
    const newOTP = new Otp({ email, otp });
    await newOTP.save();

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "Mã OTP của bạn",
      message: `<p>
            Dưới đây là mã OTP của bạn. Vui lòng không chia sẻ mã OTP với bất kỳ ai.<br/>
            Mã OTP của bạn là: <strong>${otp}</strong></p>`,
    });

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    next(error);
  }
};

// Verify OTP provided by the user
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);

    const existingOTP = await Otp.findOne({
      email,
      otp,
    });

    if (existingOTP && !existingOTP.verify) {
      // OTP is valid
      await Otp.updateOne(
        {
          email,
          otp,
        },
        { verify: true }
      );
      res
        .status(200)
        .json({ success: true, message: "OTP verification successful" });
    } else {
      // OTP is invalid
      throw createHttpError.NotFound("Invalid OTP");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    next(error);
  }
};
