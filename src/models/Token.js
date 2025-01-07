const mongoose = require("mongoose");
const tokenSchema = mongoose.Schema(
  {
    token: { type: String, required: true },
    customerId: {
      type: String,
      required: true,
      ref: "customer",
      unique: true,
    },
    time: { type: String, required: true },
  },
  { timestamp: true }
);

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
