import mongoose from "mongoose";
import { genreSchema } from "./genre.js";
import Joi from "joi";

const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    _id: mongoose.ObjectId,
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return schema.validate(movie);
}

export { Movie as Movie };
export { validateMovie as validate };
