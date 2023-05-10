const mongoose = require("mongoose");
const log4js = require("log4js");
const logger = log4js.getLogger("app");

let url =
  "mongodb+srv://online-academy:abcd-12345@cluster0.dgeox.mongodb.net/test?retryWrites=true&w=majority";

if (process.env.NODE_ENV === "test") {
  url =
    "mongodb+srv://online-academy:PPsLwAKrfxdQbiPV@online-academy.bg0ws.mongodb.net/online-academy?retryWrites=true&w=majority";
}

module.exports = (callback) => {
  mongoose.connect(
    process.env.DATABASE_URL || url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err) => {
      if (err) {
        logger.error("APP::Connection DB::Can't connection DB");
        throw new Error(err);
      } else {
        callback();
      }
    }
  );
};
