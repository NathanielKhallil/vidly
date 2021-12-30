import Joi from "joi";
import mongoose from "mongoose";

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minLength: 5,
      maxlength: 50,
    },
  })
);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
