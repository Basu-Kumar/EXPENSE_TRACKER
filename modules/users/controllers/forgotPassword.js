const mongoose = require("mongoose");

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

  const resetCode = Math.floor(10000 + Math.random() * 90000);

  await usersModel.updateOne(
    {
      email: email,
    },
    {
      reset_code: resetCode,
    },
    {
      runValidators: true,
    }
  );

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
