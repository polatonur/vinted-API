const app = require("../app");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

describe("user tests", () => {
  // initialise temporary mongoServer db
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  //stop server and disconnect
  afterEach(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  test("should add new user", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({ email: "my email", username: "Onur", password: "qwerty" })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      account: { username: "Onur" },
    });
  });

  test("should return conflict error 409", async () => {
    const response2 = await request(app)
      .post("/user/signup")
      .send({ email: "my email", username: "Onur", password: "qwerty" })
      .set("Accept", "application/json");
    const response = await request(app)
      .post("/user/signup")
      .send({ email: "my email", username: "Onur", password: "qwerty" })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({
      message: "This email has already has an account.",
    });
  });

  test("should return an email error", async () => {
    const response2 = await request(app)
      .post("/user/signup")
      .send({ username: "Onur", password: "qwerty" })
      .set("Accept", "application/json");
    expect(response2.statusCode).toBe(400);
    expect(response2.body).toEqual({ message: "You have to enter an email" });
  });

  test("should return password error", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({ username: "Onur", email: "qwerty" })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "You have to enter a password" });
  });
  test("should return username error", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({ email: "Onur", email: "qwerty" })
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "You have to enter a username" });
  });
});
