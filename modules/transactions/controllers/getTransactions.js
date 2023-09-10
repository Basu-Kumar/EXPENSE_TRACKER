// this route is to get all the transaction of a specific user

const mongoose = require("mongoose");

const getTransactions = async (req, res) => {
  const transactionsModel = mongoose.model("transactions");

  const transactions = await transactionsModel.find({
    user_id: req.user._id, // in transaction schema its user_id
    ...req.query, // for string query
  });

  res.status(200).json({
    status: "success",
    data: transactions,
  });
};

module.exports = getTransactions;
