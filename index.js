import express from "express";
import morgan from "morgan";
import config from "config";
import helmet from "helmet";
import debug from "debug";
import { genres } from "./routes/genres.js";
import { customers } from "./routes/customers.js";
import mongoose from "mongoose";

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
