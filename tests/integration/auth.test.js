const request = require("supertest");
const { Genre } = require("../../models/genre.cjs");
const { User } = require("../../models/user.cjs");

let server;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index.cjs");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });
  describe("POST /", () => {
    let token;

    const exec = () => {
      return request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "Dancing" });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    it("Should return 401 if no token is provided", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("Should return 400 if token is invalid", async () => {
      token = "a";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 200 if token is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });
  });
});
