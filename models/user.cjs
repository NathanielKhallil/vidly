const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minLength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minLength: 7,
      maxlength: 50,
    },
    password: {
      type: String,
      unique: true,
      required: true,
      minLength: 6,
      maxlength: 255,
    },
  })
);

function validateUser(user) {
  if (!mongoose.Types.ObjectId.isValid(req.id))
    return res.status(400).send("Invalid object id");

  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(7).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(user);
}
/* new function avoids errors related to mongoose.Types.ObjectId.isValid(req.id)
causing the error: ReferenceError: req is not defined on posting new users */

function validateUserPost(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(7).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(user);
}
exports.User = User;
exports.validate = validateUser;
exports.validatePost = validateUserPost;
