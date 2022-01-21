import Joi from "joi";
import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genre);
}

export { genreSchema as genreSchema };
export { Genre as Genre };
export { validateGenre as validate };
