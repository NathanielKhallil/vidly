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
const mongoose = require("mongoose");

const debugging = debug("app:startup");
const app = express();

app.set("view engine", "pug");
app.set("views", "./views"); //default

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Failed to connect to the database...."));

app.use(express.json());
app.use(helmet());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);

//config
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
console.log("Mail Password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debugging("Morgan enabled....");
}

// app.get("/api/posts/:year/:month", (req, res) => {
//   res.send(req.query);
// });

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
