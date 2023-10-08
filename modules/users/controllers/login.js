const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwtManager = require("../../../managers/jwtManager");

const login = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, password } = req.body;

  const getUser = await usersModel.findOne({
    email: email,
  });

  if (!getUser) {
    return res.status(400).json("Error: this email doesn't exist");
  }

  const comaprePassword = await bcrypt.compare(password, getUser.password); // bcrypt compare method

  if (!comaprePassword) {
    return res.status(400).json("Error: email and password doesn't match");
  }

  const accessToken = jwtManager(getUser);

  res.status(200).json({
    status: "success",
    message: "user login successfull",
    accessToken: accessToken,
  });
};

module.exports = login;
