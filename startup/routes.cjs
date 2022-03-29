const express = require("express");
const { genres } = require("../routes/genres.cjs");
const { customers } = require("../routes/customers.cjs");
const { movies } = require("../routes/movies.cjs");
const { rentals } = require("../routes/rentals.cjs");
const { users } = require("../routes/users.cjs");
const { auth } = require("../routes/auth.cjs");
const serverError = require("../middleware/error.cjs");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(serverError);
};
