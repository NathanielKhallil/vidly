const { User } = require("../../../models/user.cjs");
const auth = require("../../../middleware/auth.cjs");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should populate req.user with a valid JWT payload", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };

    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
