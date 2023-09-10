const mongoose = require("mongoose");
const validator = require("validator");
const addExpense = async (req, res) => {
  const usersModel = mongoose.model("users");
  const transactionsModel = mongoose.model("transactions");

  const { amount, remarks } = req.body;

  if (!amount) {
    return res.status(400).json({ Error: "amount is required" });
  }

  if (!remarks) {
    return res.status(400).json({ Error: "remarks is required" });
  }

  if (remarks.length < 5) {
    return res.status(400).json({ Error: "remarks too short" });
  }

  if (amount < 0) {
    return res.status(400).json({ Error: "amount must not be negative" });
  }

  // validator package input is string o/p is boolean
  if (!validator.isNumeric(amount.toString())) {
    return res.status(400).json({ Error: "amount must be numeric" });
  }

  await transactionsModel.create({
    user_id: req.user._id, // we get user id from auth jwt payload
    amount: amount,
    transaction_type: "expense",
    remarks: remarks,
  });

  //   updating the users balance after an income
  await usersModel.updateOne(
    {
      _id: req.user._id, // identifying the user using payload from auth
    },
    {
      $inc: {
        balance: amount * -1, // decreasing the balance amount
      },
    },
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "expense subtracted successfully",
  });
};

module.exports = addExpense;
