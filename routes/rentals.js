import { Rental } from "../models/rental.js";
import { validate } from "../models/rental.js";
import express from "express";
import Fawn from "fawn";
Fawn.init("mongodb://127.0.0.1:27017/vidly");

import { Movie } from "../models/movie.js";
import { Customer } from "../models/customer.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body); // equiv of result.error
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        { $inc: { numberInStock: -1 } },
        { $inc: { dailyRentalRate: +1 } }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something went wrong");
  }
});

router.put("/:id", async (req, res) => {
  //validate
  const { error } = validate(req.body); // equiv of result.error
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  // Update course
  res.send(rental);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  try {
    if (!rental)
      return res
        .status(404)
        .send("The rental with the given ID was not found.");

    res.send(rental);
  } catch (err) {
    return res.status(404).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const rental = await Rental.findByIdAndRemove(req.params.id);

    if (!rental)
      return res
        .status(404)
        .send("The rental with the given ID was not found.");

    res.send(rental);
  } catch (err) {
    return res.status(404).send(err);
  }
});

export { router as rentals };
