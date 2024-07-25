const express = require("express");
const dotenv = require("dotenv");
const user = require("./routes/user");
const serviceprovider = require("./routes/serviceprovider");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use("/api/v1/user", user);
app.use("/api/v1/serviceprovider", serviceprovider);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("connection successful"))
//   .catch((err) => {
//     console.log(err);
//   });

app.listen(process.env.PORT, () => {
  console.log("listening on port 3300");
});
