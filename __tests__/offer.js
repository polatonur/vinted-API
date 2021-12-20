const mongoose = require("mongoose");
const app = require("../app.js");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const utils = require("../utils");

let mongoServer;
let token = 0;
let userId = "";
let offerId = "";

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
    userId = response.body._id;
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
      .send({
        title: "test",
        city: "paris",
        condition: "comme neuf",
        price: 10,
        brand: "ZARA",
        color: "red",
        size: "XL",
      })
      .set("authorization", "Bearer " + token);
    offerId = response.body["-id"];
    expect(response.statusCode).toBe(200);
  });

  test("should get details of  a publication", async () => {
    const response = await request(app)
      .get(`/offer/${offerId}`)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(200);
  });

  test("should update offers name", async () => {
    const res = await request(app)
      .put(`/offer/update/${offerId}`)
      .send({ tittle: "test jest" })
      .set("authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: "The offer was succesfully updated",
    });
  });

  test("should delete an offer", async () => {
    const res = await request(app)
      .delete(`/offer/delete/${offerId}`)
      .set("authorization", `Bearer ${token}`);

    console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: "The publish was succesfully deleted",
    });
  });
});
