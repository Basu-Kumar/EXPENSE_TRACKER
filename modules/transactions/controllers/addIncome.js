const mongoose = require("mongoose");
const validator = require("validator");
const addIncome = async (req, res) => {
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

  // validator package input is string o/p is boolean
  if (!validator.isNumeric(amount.toString())) {
    return res.status(400).json({ Error: "amount must be numeric" });
  }

  await transactionsModel.create({
    user_id: req.user._id,
    amount: amount,
    transaction_type: "income",
    remarks: remarks,
  });

  await usersModel.updateOne(
    {
      _id: req.user._id,
    },
    {
      $inc: {
        balance: amount,
      },
    },
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "income added successfully",
  });
};

module.exports = addIncome;
