const winston = require("winston");
const mongoose = require("mongoose");

const logging = winston.createLogger({
  transports: [new winston.transports.Console()],
});
module.exports = function () {
  mongoose
    .connect("mongodb://localhost/vidly")
    .then(() => logging.info("Connected to MongoDB..."));
};
