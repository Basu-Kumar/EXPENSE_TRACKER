const mongoose = require("mongoose");
const validator = require("validator");

const editTransaction = async (req, res) => {
  const transactionsModel = mongoose.model("transactions");
  const usersModel = mongoose.model("users");

  // currently allowing only remarks change
  const { transaction_id, remarks } = req.body;

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

  await transactionsModel.updateOne(
    {
      _id: getTransaction._id,
    },
    {
      remarks: remarks,
    },
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "edit transaction successfull",
  });
};

module.exports = editTransaction;
