const mongoose = require("mongoose");
const validator = require("validator");

const editTransaction = async (req, res) => {
  const transactionsModel = mongoose.model("transactions");
  const usersModel = mongoose.model("users");

  // const { transaction_id, transaction_type, remarks, amount } = req.body;
  // currently allowing only remarks change so there is no need to change user data
  const { transaction_id, remarks } = req.body;

  if (!transaction_id) {
    return res.status(400).json("transaction_id not provided");
  }

  // if (transaction_type !== "income" || transaction_type !== "expense") {
  //   return res.status(400).json("invalid income type");
  // }

  // using validator to validate the transaction id

  if (!validator.isMongoId(transaction_id.toString())) {
    return res.status(400).json({ Error: "please provide a valid id" });
  }

  // getting the transaction using the id
  const getTransaction = await transactionsModel.findOne({
    _id: transaction_id,
  });

  if (!getTransaction) {
    return res.status(400).json("transaction not found");
  }

  await transactionsModel.updateOne(
    {
      _id: getTransaction._id,
    },
    {
      // transaction_type: transaction_type,
      remarks: remarks,
      // amount: amount,
    },
    {
      runValidators: true, // user can have either income/expense transaction_type
    }
  );

  // the users model will also get updated depending upon the new transaction_type
  // add code for that

  res.status(200).json({
    status: "success",
    message: "edit transaction successfull",
  });
};

module.exports = editTransaction;
