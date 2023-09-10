const express = require("express");
const addIncome = require("./controllers/addIncome");
const addExpense = require("./controllers/addExpense");
const getTransactions = require("./controllers/getTransactions");
const auth = require("../../middleware/auth");
const deleteTransaction = require("./controllers/deleteTransaction");
const editTransaction = require("./controllers/editTransaction");

// to makes transaction routes separately and not declaraing in app.js
const transactionRoutes = express.Router();

// authentication route
transactionRoutes.use(auth);

// protected route
transactionRoutes.post("/addIncome", addIncome);
transactionRoutes.post("/addExpense", addExpense);
transactionRoutes.get("/", getTransactions);
transactionRoutes.delete("/:transaction_id", deleteTransaction);
transactionRoutes.patch("/", editTransaction);

module.exports = transactionRoutes;
