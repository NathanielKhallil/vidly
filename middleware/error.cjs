const winston = require("winston");

exports.serverError = function (err, req, res, next) {
  winston.error(err.message);

  res.status(500).send("Something went wrong.");
};
