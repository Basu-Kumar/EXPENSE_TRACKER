const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user_id: {
      // need to connect users and transaction
      // only registered users have transaction in db(userID in objectID)
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    transaction_type: {
      type: String,
      required: true,
      enum: ["income", "expense"], // only these two inputs allowed
    },

    remarks: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // also adds the timestamp for a specific user
);

const transactionsModel = mongoose.model("transactions", transactionSchema);

module.exports = transactionsModel;
