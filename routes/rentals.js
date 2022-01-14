import express from "express";
import { rental, validate } from "../models/rental";

const router = express.Router();

const { Genre } = require("../models/genre");

router.get("/", async (req, res) => {
  const rentals = await rental.find().sort("name");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body); // equiv of result.error
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  let rental = new Rental({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  rental = await rental.save();
  res.send(rental);
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
  const rental = await rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

router.delete("/:id", async (req, res) => {
  const rental = await rental.findByIdAndRemove(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

export { router as rentals };
