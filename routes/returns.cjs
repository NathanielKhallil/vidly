const express = require("express");
const router = express.Router();

const Joi = require("joi");
const { Customer } = require("../models/customer.cjs");
const { Movie } = require("../models/movie.cjs");
const { Rental } = require("../models/rental.cjs");
const auth = require("../middleware/auth.cjs");
const validate = require("../middleware/validate.cjs");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("No rental found ");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed.");

  await rental.return();

  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  return res.send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(req);
}

module.exports = router;
