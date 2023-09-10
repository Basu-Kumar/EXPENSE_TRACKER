const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const emailManager = require("../../../managers/emailManager");

const forgotPassword = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email } = req.body;

  if (!email) {
    return res.status(400).json("email must be provided");
  }

  const getUser = await usersModel.findOne({
    email: email,
  });

  if (!getUser) {
    return res.status(400).json("This email doesn't exist");
  }

  // creating reset code as the user is verified
  const resetCode = Math.floor(10000 + Math.random() * 90000);

  await usersModel.updateOne(
    {
      email: email, // finding that user
    },
    {
      reset_code: resetCode, // updating the field
    },
    {
      runValidators: true,
    }
  );

  // now we have send this reset code on email
  // transport is like configure of nodemailer
  /*var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f4f6b4d6bff3cb",
      pass: "37062f7aeca0d8",
    },
  });

  await transport.sendMail({
    to: email,
    from: "info@expensetracker.com",
    text: "the code to reset password " + resetCode,
    html: "<h1>the code to reset password </h1>" + resetCode,
    subject: "reset code",
  });*/

  await emailManager(
    email,
    "the code to reset password " + resetCode,
    "<h1>the code to reset password </h1>" + resetCode,
    "reset code"
  );

  res.status(200).json({
    status: "reset code sent successfully",
  });
};

module.exports = forgotPassword;
