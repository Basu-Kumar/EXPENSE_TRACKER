const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwtManager = require("../../../managers/jwtManager");
const nodemailer = require("nodemailer");
const addExpense = require("../../transactions/controllers/addExpense");
const emailManager = require("../../../managers/emailManager");

const register = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { name, email, password, confirm_password, balance } = req.body;

  if (!email) {
    return res.status(400).json({ error: "provide email address" });
  }

  if (!name) {
    return res.status(400).json({ error: "Enter name" });
  }

  if (!password) {
    return res.status(400).json({ error: "Enter valid password" });
  }

  if (password.length < 5) {
    return res
      .status(400)
      .json({ error: "keep password of at least length 5" });
  }

  if (password !== confirm_password) {
    return res
      .status(400)
      .json({ error: "confirm_password doesn't match the password" });
  }

  const getDuplicateEmail = await usersModel.findOne({
    email: email,
  });

  if (getDuplicateEmail) {
    return res
      .status(400)
      .json({ error: "A user with this email already exist..." });
  }

  // hashing of the password

  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = await usersModel.create({
    name: name,
    email: email,
    password: hashedPassword,
    balance: balance,
  });

  const accessToken = jwtManager(createdUser);

  await emailManager(
    createdUser.email,
    "Welcome to expense tracker.Manage your expenses wisely",
    "<h1>Welcome to expense tracker.</h1>Manage your expenses wisely",
    "Expense Tracker"
  );

  res.status(201).json({
    status: "user registered successfully",
    accessToken: accessToken,
  });
};

module.exports = register;
