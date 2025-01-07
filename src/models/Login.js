const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const loginSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String},
  type: { type: String, required: true },
  token: String,
});
loginSchema.pre("save", async function () {
  if (!this.password) return;
  try {
    console.log('login password:',this.password);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
  } catch (err) {
    next(err);
  }
});

const Login = mongoose.model("Login", loginSchema);
module.exports = Login;
