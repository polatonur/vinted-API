const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  console.log(req.headers.authorization);
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });
    if (user) {
      req.user = user;
      return next();
    } else {
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  } else {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = isAuthenticated;
