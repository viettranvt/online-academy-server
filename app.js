const http = require("http");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const HttpStatus = require("http-status-codes");
const fs = require("fs");
require("express-async-errors");
const db = require("./database/db");

const UsersDumpData = require("./dump-data/user.dump-data");

//// create logs folder
// if (!fs.existsSync('./logs')) {
//   fs.mkdirSync('./logs');
// }

//// config log4js
const log4js = require("log4js");
//// created file logger
//log4js.configure('./config/log4js.json');
const loggerApp = log4js.getLogger("app");

const app = express();
app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", require("./routes"));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  return res.status(HttpStatus.NOT_FOUND).json({
    messages: ["Not Found"],
    status: HttpStatus.NOT_FOUND,
  });
});

// error handler
app.use((err, req, res, next) => {
  const msg = err.message ? err.message : JSON.stringify(err);

  loggerApp.error("APP::error ", JSON.stringify(err));

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    messages: [msg],
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  });
});

//get the port and set the port for the server
const port = process.env.PORT || 3500;
app.set("port", port);

//create server
const server = http.createServer(app);
server.setTimeout(10 * 60 * 1000);

//test the database connection before running the server
db(() => {
  loggerApp.info("APP::Database connection successful");
  server.listen(port, () => {
    loggerApp.info("APP::Server is running on port ", port);
    UsersDumpData();
  });
});

module.exports = app;
