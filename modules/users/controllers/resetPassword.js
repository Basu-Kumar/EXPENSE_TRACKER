const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const emailManager = require("../../../managers/emailManager");

const resetPassword = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, new_password, reset_code } = req.body;

  if (!email) {
    res.status(400).json("email is not provided");
  }

  if (!new_password) {
    res.status(400).json("new_password is not provided");
  }

  if (!reset_code) {
    res.status(400).json("reset_code is not provided");
  }

  if (new_password.length < 5) {
    res.status(400).json("new_password is too short");
  }

  const getUser = await usersModel.findOne({
    email: email,
    reset_code: reset_code,
  });

  if (!getUser) {
    res.status(400).json("the reset code doesn't match");
  }

  const hashedPassword = await bcrypt.hash(new_password, 12);

  await usersModel.updateOne(
    {
      email: email,
    },
    {
      password: hashedPassword,
      reset_code: "", // deleting the reset from usersdatabase or else user will keep on changing the password
    },
    {
      runValidators: true,
    }
  );

  await emailManager(
    email,
    "code reset successfull",
    "<p>code reset successfull</p>",
    "success message"
  );

  res.status(200).json({
    status: "success",
    message: "password reset successfull",
  });
};

module.exports = resetPassword;
