const express = require("express");
const morgan = require("morgan");
const debug = require("debug");
const winston = require("winston");
const debugging = debug("app:startup");
const app = express();

require("./startup/logging.cjs")(app);
require("./startup/routes.cjs")(app);
require("./startup/db.cjs")();
require("./startup/config.cjs")();
require("./startup/validation.cjs")();
require("./startup/prod.cjs")(app);

app.set("view engine", "pug");
app.set("views", "./views"); //default

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debugging("Morgan enabled....");
}

const logging = winston.createLogger({
  transports: [new winston.transports.Console()],
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
  logging.info(`Listening on port ${port}...`)
);

console.log(process.env.db);
module.exports = server;
