const request = require("supertest");
const { Customer } = require("../../models/customer.cjs");
const { User } = require("../../models/user.cjs");

let server;

describe("/api/customers", () => {
  beforeEach(() => {
    server = require("../../index.cjs");
  });
  afterEach(async () => {
    server.close();
    await Customer.remove({});
  });
  describe("GET /", () => {
    it("should return all customers", async () => {
      await Customer.collection.insertMany([
        { name: "customer1", phone: "4038490675", isGold: true },
        { name: "customer2", phone: "4038490675", isGold: true },
      ]);
      const res = await request(server).get("/api/customers");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "customer1"));
      expect(res.body.some((g) => g.name === "customer2"));
    });
  });

  describe("GET /:id", () => {
    it("should return the customer matching the provided Id.", async () => {
      const customer = new Customer({
        name: "customer1",
        phone: "4038490675",
        isGold: true,
      });
      await customer.save();

      const res = await request(server).get("/api/customers/" + customer._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", customer.name);
    });

    it("should return 404 if an invalid ID is passed.", async () => {
      const res = await request(server).get("/api/customers/0");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    // Define the happy path, and then in each test we change
    // one parameter that clearly aligns with the name of the
    //
    let token;
    let name;
    let phone;
    let isGold;

    const exec = async () => {
      return await request(server)
        .post("/api/customers")
        .set("x-auth-token", token)
        .send({ name })
        .send({ phone })
        .send({ isGold });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "Steve";
      phone = "4038490675";
      isGold = true;
    });

    it("Should return 401 ERROR if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("Should return 400 if customer is invalid", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if customer is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("Should return 400 if customer is more than 20 characters", async () => {
      name = new Array(22).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should save the new customer if it is valid", async () => {
      await exec();

      const customer = await Customer.find({ name: "Steve" });
      expect(customer).not.toBeNull();
    });
    it("Should return the new customer if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "Steve");
    });
  });
});
