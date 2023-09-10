const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: true, // only unique email is allowed
    },

    password: {
      type: String,
      required: [true, "password is required"],
    },

    balance: {
      type: Number,
      required: [true, "balance is required"],
      default: 0,
    },
    reset_code: {
      type: Number,
    },
  },
  { timestamps: true } // also adds the timestamp for a specific user
);

const usersModel = mongoose.model("users", usersSchema);

module.exports = usersModel;
