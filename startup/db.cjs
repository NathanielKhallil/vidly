const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

const logging = winston.createLogger({
  transports: [new winston.transports.Console()],
});
module.exports = function () {
  const db = config.get("db");
  mongoose.connect(db).then(() => logging.info(`Connected to ${db}...`));
};
