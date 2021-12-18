const mongoose = require("mongoose");
const app = require("./app");

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

app.listen(process.env.PORT || 5000, () => console.log("Server is running..."));
