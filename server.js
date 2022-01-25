const express = require("express");
const mongooose = require("mongoose");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const app = express();

//load configuration from .env file
require("dotenv-flow").config();

app.use(bodyParser.json());

mongooose
  .connect(process.env.DBHOST, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .catch((error) => console.log("Error connecting to MongoDB" + error));

mongooose.connection.once("open", () =>
  console.log("Connected successfully to MongoDB")
);

// routes
app.get("/api/welcome", (req, res) => {
  res.status(200).send({ message: "Welcome to your first node-js route" });
});

app.use("/api/products", productRoutes);
app.use("/api/user", authRoutes);

//start up server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});

module.exports = app;
