const mongoose = require("mongoose");
const app = require("../app.js");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let token = 0;

describe("offer tests", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("should create a user to test routes which need an authentificatiov", async () => {
    const response = await request(app)
      .post("/user/signup")
      .send({ username: "onur", password: "qwerty", email: "onur@gmail.com" })
      .set("Accept", "application/json");
    token = response.body.token;
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      account: { username: "onur" },
    });
  });

  test("should login with created user informations", async () => {
    response = await request(app)
      .post("/user/login")
      .send({ email: "onur@gmail.com", password: "qwerty" });
    expect(response.statusCode).toBe(200);
  });

  test("should return all publications", async () => {
    const response = await request(app)
      .get("/offers")
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ count: 0, offers: [] });
  });

  test("should create a new publish", async () => {
    const response = await request(app)
      .post("/offer/publish")
      .send()
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(401);
  });
});

test("offer test", () => {
  expect(true).toBe(true);
});
