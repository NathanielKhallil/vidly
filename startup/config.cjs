const config = require("config");

module.exports = function () {
  console.log("Application Name: " + config.get("name"));
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined!");
  }
};
