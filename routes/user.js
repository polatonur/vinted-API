const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");
const Offer = require("../models/Offer");

router.post("/user/signup", async (req, res) => {
  try {
    if (!req.fields.email) {
      res.status(400).json({
        message: "You have to enter an email",
      });
    } else if (!req.fields.username) {
      res.status(400).json({
        message: "You have to enter a username",
      });
    } else if (!req.fields.password) {
      res.status(400).json({
        message: "You have to enter a password",
      });
    } else {
      if (await User.findOne({ email: req.fields.email })) {
        res.status(409).json({
          message: "This email has already has an account.",
        });
      } else {
        const salt = uid2(16);
        const password = req.fields.password;
        const hash = SHA256(password + salt).toString(encBase64);
        const token = uid2(16);

        const newUser = new User({
          email: req.fields.email,
          account: {
            username: req.fields.username,
            phone: req.fields.phone,
            avatar: req.fields.avatar,
          },
          token: token,
          hash: hash,
          salt: salt,
        });
        await newUser.save();
        res.status(200).json({
          _id: newUser.id,
          token: newUser.token,
          account: newUser.account,
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    if (await User.findOne({ email: req.fields.email })) {
      const user = await User.findOne({ email: req.fields.email });
      const hashToCompare = SHA256(req.fields.password + user.salt).toString(
        encBase64
      );
      if (user.hash === hashToCompare) {
        res.status(200).json({
          _id: user.id,
          token: user.token,
          account: user.account,
        });
      } else {
        res.status(401).json({
          message: "Unautorized user",
        });
      }
    } else {
      res.status(401).json({
        message: "Unautorized user",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
