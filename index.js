const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const cors = require("cors");
require("dotenv").config();
const isAuthenticated = require("./middleware/isAuthenticated");

const app = express();
app.use(formidableMiddleware());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const userRouter = require("./routes/user");
app.use(userRouter);
const offerRouter = require("./routes/offer");
app.use(offerRouter);
const paymentRoutes = require("./routes/payment");
app.use(paymentRoutes);

app.post("/offers/pay", isAuthenticated, async (req, res) => {
  console.log("coucou");
  // try {
  //   console.log(req.fields);
  //   const response = await stripe.charges.create({
  //     amount: req.fields.price * 100, // en centimes
  //     currency: "eur",
  //     description: "La description du produit...",
  //     source: req.fields.stripeToken,
  //   });
  //   console.log("La réponse de Stripe ====> ", response);
  //   if (response.status === "succeeded") {
  //     res.status(200).json({ message: "Paiement validé" });
  //   } else {
  //     res.status(400).json({ message: "An error occured" });
  //   }
  // } catch (error) {
  //   res.status(400).json({ message: error.message });
  // }
});
app.all("*", (req, res) => {
  res.status(404).json({
    message: "Ooops!, page not found",
  });
});
// process.env.PORT ||
app.listen(3001, () => console.log("Server is running..."));
