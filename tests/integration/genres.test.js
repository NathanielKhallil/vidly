const request = require("supertest");
const { Genre } = require("../../models/genre.cjs");
const { User } = require("../../models/user.cjs");
const mongoose = require("mongoose");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index.cjs");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1"));
      expect(res.body.some((g) => g.name === "genre2"));
    });
  });

  describe("GET /:id", () => {
    it("should return the genre matching the provided Id.", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
    it("should return 404 if an invalid ID is passed.", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with given Id exists.", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    // Define the happy path, and then in each test we change
    // one parameter that clearly aligns with the name of the
    //
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "Dancing";
    });

    it("Should RETURN 401 ERROR if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("Should return 400 if genre is invalid", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if genre is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("Should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should save the new genre if it is valid", async () => {
      await exec();

      const genre = await Genre.find({ name: "Dancing" });
      expect(genre).not.toBeNull();
    });
    it("Should return the new genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "Dancing");
    });
  });
  describe("PUT /:id", () => {
    let token;
    let genre;
    let newName;
    let id;

    const exec = async () => {
      return await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      genre = new Genre({ name: "Dancing" });
      await genre.save();

      token = new User().generateAuthToken();
      id = genre._id;
      newName = "Dancing2";
    });

    it("Should return 401 ERROR if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });
    it("should return 404 if id is invalid", async () => {
      id = "";

      const res = await exec();

      expect(res.status).toBe(404);
    });
    it("should return 404 if the Genre is not found", async () => {
      await Genre.remove({});

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("Should return 400 if genre is less than 5 characters", async () => {
      newName = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if genre is more than 50 characters", async () => {
      newName = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if no genre with given Id exists.", async () => {
      id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });

    it("should update the genre if input is valid", async () => {
      await exec();

      const updatedGenre = await Genre.findById(genre._id);

      expect(updatedGenre.name).toBe(newName);
    });

    it("should return the updated genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name");
    });
  });
  describe("DELETE /:id", () => {
    let token;
    let genre;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      genre = new Genre({ name: "Dancing" });
      await genre.save();

      token = new User({ isAdmin: true }).generateAuthToken();
      id = genre._id;
    });
    it("should return 404 if no genre with the given Id exists.", async () => {
      id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
    it("should return 404 if the Id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });
    it("should return 404 if the Genre is not found", async () => {
      await Genre.remove({});

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 403 if the user is not an admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toEqual(403);
    });

    it("Should return 401 ERROR if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });
    it("should delete the genre associated with the Id provided if the Id is valid", async () => {
      await exec();
      const deletedGenre = await Genre.findById(genre._id);

      expect(deletedGenre).toBeNull();
    });
    it("should return the removed genre", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
