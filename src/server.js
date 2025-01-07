require("dotenv").config();
const express = require("express");
const app = express();
const port = Number(process.env.PORT) || 80; // port
const hostname = process.env.HOST_NAME; // hostname
const mergeRoute = require("./routes/index");
const connection = require("./config/database");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const configStaticFiles = require("./config/staticFile");
const store = session.MemoryStore();
const passport = require("passport");
configStaticFiles(app);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.KEY__SESSION,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 20,
    },
    store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// add routes
app.use(mergeRoute);
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    message: err.message || "no content",
  });
});
(async function () {
  try {
    await connection();
    app.listen(port, hostname, () => {
      console.log(`Server is listening on port:${port}`);
    });
  } catch (err) {
    console.log(">> ERROR CONNECT TO DB", err);
  }
})();
