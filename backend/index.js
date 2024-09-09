const express = require("express");
const dotenv = require("dotenv");
const user = require("./routes/user");
const serviceprovider = require("./routes/serviceprovider");
const booking = require("./routes/booking");
const rating = require("./routes/rating");
const location = require("./routes/location");
const distance = require("./routes/distance");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1/user", user);
app.use("/api/v1/serviceprovider", serviceprovider);
app.use("/api/v1/booking", booking);
app.use("/api/v1/rating", rating);
app.use("/api/v1/location", location);
app.use("/api/v1/distance", distance);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("connection successful"))
//   .catch((err) => {
//     console.log(err);
//   });

app.listen(process.env.PORT, () => {
  console.log("listening on port 3300");
});
