const winston = require("winston");
const express = require("express");
require("winston-mongodb");
require("express-async-errors");

module.exports = function (app) {
  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExeptions.log" })
  );
  //   winston.rejections.handle(
  //     new winston.transports.File({ filename: "uncaughtRejections.log" })
  //   );

  //   process.on("uncaughtException", (ex) => {
  //     winston.error(ex.message, ex);
  //     process.exit(1);
  //   });

  //   process.on("unhandledRejection", (ex) => {
  //     winston.error(ex);
  //     process.exit(1);
  //   });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(function (req, res, next) {
    if (req.headers["content-type"] === "application/json;") {
      req.headers["content-type"] = "application/json";
    }
    next();
  });

  const logging = winston.createLogger({
    transports: [
      new winston.transports.Console({ colorize: true, PrettyPrint: true }),
      new winston.transports.MongoDB({
        db: "mongodb+srv://ViktorKhallil:1234@cluster0.bwsa3.mongodb.net/Vidly?retryWrites=true&w=majority",
        level: "info",
        format: winston.format.json(),
      }),
    ],
  });

  app.use((req, res, done) => {
    logging.info(
      `${req.method} ${JSON.stringify(req.body)}/${JSON.stringify(
        req.params
      )} request made for ${req.originalUrl}}`
    );
    done();
  });
};
