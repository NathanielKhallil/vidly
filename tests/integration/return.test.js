const request = require("supertest");
const moment = require("moment");
const { Rental } = require("../../models/rental.cjs");
const mongoose = require("mongoose");
const { User } = require("../../models/user.cjs");
const { Movie } = require("../../models/movie.cjs");

// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental is found for this customer/movie
// Return 400 if rental already processed
// Return 200 if valid request
// Set the return date
// Calculate the rental fee
// Increase the stock
// Return the rental

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;

  const exec = async () => {
    return await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index.cjs");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "movie title",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.remove({});
  });

  it("should work", async () => {
    const result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
  });
  it("should return 401 if the customer is not logged in.", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });
  it("should return error 400 if the customerId is not provided.", async () => {
    customerId = null;
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return error 400 if the movieId is not provided.", async () => {
    movieId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return error 404 if no rental found for the customer/movie.", async () => {
    await Rental.remove({});
    const res = await exec();

    expect(res.status).toBe(404);
  });
  it("should return error 400 if the rental is already processed.", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should return 200 if valid request.", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
  it("should return set the return date.", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const difference = new Date() - rentalInDb.dateReturned;

    expect(difference).toBeLessThan(10 * 1000);
  });
  it("should calculate the rental fee.", async () => {
    // const res = await exec();
    // const rentalInDb = await Rental.findById(rental._id);
    // const dateRented = (await rentalInDb.dateReturned) - 5;
    // const numberOfDays = (await rentalInDb.dateReturned) - dateRented;
    // const rentalFee = (await rental.movie.dailyRentalRate) * numberOfDays;

    // expect(rentalFee).toBe(numberOfDays * rental.movie.dailyRentalRate);

    rental.dateOut = moment().add(-5, "days").toDate();
    await rental.save();
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(10);
  });
  it("should increase the stock count of the returned movie.", async () => {
    const res = await exec();
    const movieInDb = await Movie.findById(movieId);

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("should return the rental if the input is valid.", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);

    // expect(res.body).toHaveProperty("dateOut");
    // expect(res.body).toHaveProperty("dateReturned");
    // expect(res.body).toHaveProperty("rentalFee");
    // expect(res.body).toHaveProperty("customer");
    // expect(res.body).toHaveProperty("movie");
    // can be refactored for less repetition.
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
