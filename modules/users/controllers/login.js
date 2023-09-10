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

  // checking if the user exist with that email and if not throw error
  if (!getUser) {
    return res.status(400).json("Error: this email doesn't exist");
  }
  // consoling the data if the user exists
  //   console.log(getUser);

  // comparing the password entered by user and the password we have in database for same email
  const comaprePassword = await bcrypt.compare(password, getUser.password); // bcrypt compare method

  if (!comaprePassword) {
    // // existence of email already checked
    return res.status(400).json("Error: email and password doesn't match");
  }

  // after the password has been matched (creating jwt tokens) for user authentication and passing some info
  /*const accesstoken = jsonwebtoken.sign(
    {
      _id: getUser._id,
      name: getUser.name, // the second parameter is secret key for verifying the user
    },
    process.env.jwt_salt
  );*/

  const accessToken = jwtManager(getUser);

  // success response
  res.status(200).json({
    status: "success",
    message: "user login successfull",
    accessToken: accessToken, // when the user logins success we provide access token
  });
};

module.exports = login;
