const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

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
  if (!mongoose.Types.ObjectId.isValid(req.id)) {
    return res.status(400).send("Invalid object id");
  }
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
  });
  return schema.validate(genre);
}
/* new function avoids errors related to mongoose.Types.ObjectId.isValid(req.id)
causing the error: ReferenceError: req is not defined on posting new users */
function validateGenrePost(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
  });
  return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
exports.validatePost = validateGenrePost;
