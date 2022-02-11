const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 6,
  max: 255,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

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
      unique: true,
      minLength: 7,
      maxlength: 50,
    },
    password: {
      type: String,
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
    password: passwordComplexity(complexityOptions).required(),
  });
  return schema.validate(user);
}
/* new function avoids errors related to mongoose.Types.ObjectId.isValid(req.id)
causing the error: ReferenceError: req is not defined on posting new users */

function validateUserPost(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(7).max(50).required().email(),
    password: passwordComplexity(complexityOptions).required(),
  });
  return schema.validate(user);
}
exports.User = User;
exports.validate = validateUser;
exports.validatePost = validateUserPost;
