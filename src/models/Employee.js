const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const bcrypt = require("bcrypt");
const employeeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: String,
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phoneNumber: String,
    birthDay: String,
    address: String,
    role: String,
    login:{type:String,ref:"Login"}
  },
  { timestamps: true }
);
employeeSchema.plugin(mongoose_delete, { overrideMethods: "all" });

// employeeSchema.methods.isPasswordMatch = async function (password) {
//   try {
//     console.log(this.password);

//     return await bcrypt.compare(password, this.password);
//   } catch (error) {
//     console.log(error);

//     return false;
//   }
// };

employeeSchema.statics.isEmailTaken = async function (email) {
  const employee = await this.findOne({ email: email });
  if (employee) return true;
  return false;
};
// employeeSchema.pre("save", async function () {
//   if (!this.password) return;
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(this.password, salt);

//     this.password = hashPassword;
//   } catch (err) {
//     next(err);
//   }
// });
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
