require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const morgan = require("morgan");
const config = require("config");
const helmet = require("helmet");
const debug = require("debug");
const { genres } = require("./routes/genres.cjs");
const { customers } = require("./routes/customers.cjs");
const { movies } = require("./routes/movies.cjs");
const { rentals } = require("./routes/rentals.cjs");
const { users } = require("./routes/users.cjs");
const { auth } = require("./routes/auth.cjs");
const { serverError } = require("./middleware/error.cjs");
const mongoose = require("mongoose");
const { transports } = require("winston");
const debugging = debug("app:startup");
const app = express();

winston.configure({
  transports: [
    new winston.transports.File({
      filename: "logfile.log",
      level: "error",
      format: winston.format.json(),
    }),
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "error",
      format: winston.format.json(),
    }),
  ],
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      format: winston.format.json(),
    }),
  ],
});

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined!");
  process.exit(1);
}

app.set("view engine", "pug");
app.set("views", "./views"); //default

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Failed to connect to the database...."));

app.use(function (req, res, next) {
  if (req.headers["content-type"] === "application/json;") {
    req.headers["content-type"] = "application/json";
  }
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, done) => {
  console.log(JSON.stringify(req.query.id));
  logger.info(
    `${req.method} ${JSON.stringify(req.body)}/${JSON.stringify(
      req.params
    )} request made for ${req.originalUrl}}`
  );

  done();
});

app.use(express.json());
app.use(helmet());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(serverError);

//config
console.log("Application Name: " + config.get("name"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debugging("Morgan enabled....");
}

// app.get("/api/posts/:year/:month", (req, res) => {
//   res.send(req.query);
// });

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
