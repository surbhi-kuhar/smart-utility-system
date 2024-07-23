const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const user = require("./routes/user");

dotenv.config();

const app = express();

app.use('/api/v1/user', user);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connection successful"))
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log("listening on port 3300");
});
