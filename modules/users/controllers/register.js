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

  // validations(since throw is not working use return)
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

  // checking the email request of body already exist or not
  const getDuplicateEmail = await usersModel.findOne({
    email: email,
  });

  /* this wasn't working
  if (getDuplicateEmail) throw "the email already exist";*/

  // we can't enter two users with same email as each email must be unique...it will throw error
  if (getDuplicateEmail) {
    return res
      .status(400)
      .json({ error: "A user with this email already exist..." });
  }

  // hashing of the password

  const hashedPassword = await bcrypt.hash(password, 12); //(string to hash,rounds of hashing)

  const createdUser = await usersModel.create({
    name: name,
    email: email,
    password: hashedPassword,
    balance: balance,
  });

  //creating access token when registering(so that when user registers also gets loggedin)
  /*const accesstoken = jsonwebtoken.sign(
    {
      _id: createdUser._id,
      name: createdUser.name, // the second parameter is secret key for verifying the user
    },
    process.env.jwt_salt
  );
    */

  const accessToken = jwtManager(createdUser);

  // transport is like configure of nodemailer
  /* var transport = nodemailer.createTransport({
  //   host: "sandbox.smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "f4f6b4d6bff3cb",
  //     pass: "37062f7aeca0d8",
  //   },
  // });

  // await transport.sendMail({
  //   to: createdUser.email,
  //   from: "info@expensetracker.com",
  //   text: "Welcome to expense tracker.Manage your expenses wisely",
  //   html: "<h1>Welcome to expense tracker.</h1>Manage your expenses wisely",
  //   subject: "Expense Tracker",
  });*/

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
