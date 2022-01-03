const express = require("express");
const router = express.Router();
const formidableMiddleware = require("express-formidable");
const utils = require("../utils");
router.use(formidableMiddleware());

router.post("/payment", async (req, res) => {
  try {
    const paymentIntent = await utils.payment(
      req.fields.amount,
      req.fields.title
    );
    console.log(paymentIntent);
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
