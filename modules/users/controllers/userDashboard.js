const mongoose = require("mongoose");

const userDashboard = async (req, res) => {
  // passed by middleware(to protected routes)   : (req.user)

  const usersModel = mongoose.model("users");
  const transactionsModel = mongoose.model("transactions");

  // finding the user with the help of jwt payload received from auth
  const getUser = await usersModel
    .findOne({
      _id: req.user._id,
    })
    .select("name balance email"); // selecting specific info as we don't want to display all info
  //.select("-password -name") // excluding the info we don't want

  const transactions = await transactionsModel
    .find({
      user_id: req.user._id,
    })
    .sort("-createdAt") // sorts the transaction on parameter basis
    .limit(5); // limit the number of transaction to show

  res.status(200).json({
    status: "success",
    data: getUser,
    transactions: transactions,
  });
};

module.exports = userDashboard;
