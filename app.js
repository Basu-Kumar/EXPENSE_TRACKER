require("express-async-errors");
const { error } = require("console");
const express = require("express");
const cors = require("cors");
const errorhandler = require("./handler/errorhandler");
require("dotenv").config();
const mongoose = require("mongoose");
const userRoutes = require("./modules/users/users.routes");
const transactionRoutes = require("./modules/transactions/transactions.routes");
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.mongo_connection, {})
  .then(() => {
    console.log("connection to mongoDB successful");
  })
  .catch(() => {
    console.log("connection to mongoDB failed");
  });

// model initialisation
require("./models/user.model");
require("./models/transactions.model");

//user routes:if a request is made for localhost 8000/api/users then redirect it to userRoutes
// that is all will be handled by this userRoutes
app.use("/api/users", userRoutes); // importing router from express app.use()...
app.use("/api/transactions", transactionRoutes);

// at the end of all routes importing error handler

app.all("*", () => {
  // any route that doesn't lie above
  res.status(400).json({
    status: "failed",
    message: "not found",
  });
});

app.use(errorhandler);

app.listen(8000, () => {
  console.log("server connected successfully");
});
