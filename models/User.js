const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: { unique: true, type: String },
  account: {
    username: {
      required: true,
      type: String,
    },
    phone: String,
    avatar: mongoose.Schema.Types.Mixed, // nous verrons plus tard comment uploader une image
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
