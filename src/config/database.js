require("dotenv").config();
const mongoose = require("mongoose");
var dbState = [
  {
    value: 0,
    label: "disconnected",
  },
  {
    value: 1,
    label: "connected",
  },
  {
    value: 2,
    label: "connecting",
  },
  {
    value: 3,
    label: "disconnecting",
  },
];

const connection = async () => {
  try {
    const options = {
      // user: process.env.DB_USER,
      // pass: process.env.DB_PASSWORD,
      dbName: process.env.DB_NAME,
      maxPoolSize: 999,
      minPoolSize: 3,
    };
    await mongoose.connect(process.env.DB_HOST,options);
    const state = Number(mongoose.connection.readyState);
    console.log(dbState.find((f) => f.value == state).label, "to db");
  } catch (err) {
    console.log(">> Error connection DB:", err);
  }
};
module.exports = connection;
