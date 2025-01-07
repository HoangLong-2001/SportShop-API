const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const bcrypt = require("bcrypt");

const customerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    age: Number,
    gender: String,
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    birthDay: Date,
    address: String,
    login: { type: String, ref: "Login" },
  },
  { timestamps: true }
);
customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });

customerSchema.methods.isPasswordMatch = async function (password) {
  try {
    console.log(this.password);

    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log(error);

    return false;
  }
};

customerSchema.statics.isEmailTaken = async function (email) {
  const customer = await this.findOne({ email: email });
  return customer;
};
// customerSchema.pre("save", async function () {
//   if (!this.password) return;
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(this.password, salt);
//     this.password = hashPassword;
//   } catch (err) {
//     next(err);
//   }
// });
const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
