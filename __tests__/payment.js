const request = require("supertest");
const app = require("../app");
const utils = require("../utils");

test("should make a payment", async () => {
  const response = await request(app)
    .post("/payment")
    .send({
      amount: 50,
      title: "onur",
    })
    .set("Accept", "application/json");
  console.log(response.body);
  expect(response.statusCode).toBe(200);
});

// utils.payment.mockReset();
