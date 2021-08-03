const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const cors = require("cors");
require("dotenv").config();

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

app.all("*", (req, res) => {
  res.status(404).json({
    message: "Ooops!, page not found",
  });
});

app.listen(process.env.PORT || 5000, () => console.log("Server is running..."));
