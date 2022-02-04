const mongoose = require("mongoose");
const _ = require("lodash");
const express = require("express");
const { User, validate, validatePost } = require("../models/user.cjs");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  await user.save();

  res.send(_.pick(user, ["_id", "name", "email", "password"]));
});

exports.users = router;
