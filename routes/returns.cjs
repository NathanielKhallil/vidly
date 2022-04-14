const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Customer } = require("../models/customer.cjs");
const { Movie } = require("../models/movie.cjs");
const { Rental } = require("../models/rental.cjs");
const auth = require("../middleware/auth.cjs");

router.post("/", auth, async (req, res) => {
  //   const customer = await Customer.findById(req.body.customerId);
  if (!req.body.customerId)
    return res.status(400).send("CustomerId not provided.");

  //   const movie = await Movie.findById(req.body.movieId);
  if (!req.body.movieId) return res.status(400).send("Invalid movie.");

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
  if (!rental) return res.status(404).send("No rental found ");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed.");

  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

  await rental.save();
  return res.status(200).send();
});

module.exports = router;
