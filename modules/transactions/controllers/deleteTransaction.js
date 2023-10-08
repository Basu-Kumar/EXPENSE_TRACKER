const mongoose = require("mongoose");
const validator = require("validator");

const deleteTransaction = async (req, res) => {
  const transactionsModel = mongoose.model("transactions");
  const usersModel = mongoose.model("users");

  const { transaction_id } = req.params;

  if (!transaction_id) {
    return res.status(400).json("transaction_id not provided");
  }

  if (!validator.isMongoId(transaction_id.toString())) {
    return res.status(400).json({ Error: "please provide a valid id" });
  }

  const getTransaction = await transactionsModel.findOne({
    _id: transaction_id,
  });

  if (!getTransaction) {
    return res.status(400).json("transaction not found");
  }

  if (getTransaction.transaction_type === "income") {
    await usersModel.updateOne(
      {
        _id: getTransaction.user_id,
      },
      {
        $inc: {
          balance: getTransaction.amount,
        },
      },
      {
        runValidators: true,
      }
    );
  } else {
    await usersModel.updateOne(
      {
        _id: getTransaction.user_id,
      },
      {
        $inc: {
          balance: getTransaction.amount * -1,
        },
      },
      {
        runValidators: true,
      }
    );
  }

  await transactionsModel.deleteOne({
    _id: transaction_id,
  });

  res.status(200).json({
    status: "success",
    message: "transaction deleted successfully",
  });
};

module.exports = deleteTransaction;
