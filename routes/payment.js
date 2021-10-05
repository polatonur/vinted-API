const express = require("express");
const router = express.Router();
const formidableMiddleware = require("express-formidable");
router.use(formidableMiddleware());

const stripe = require("stripe")(process.env.PRIVATE_KEY);

router.post("/payment", async (req, res) => {
  console.log("ok");
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.fields.amount * 100,
      currency: "eur",
      description: `Paiement vinted pour : ${req.fields.title}`,
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
