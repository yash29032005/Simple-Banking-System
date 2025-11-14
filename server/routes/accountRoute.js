const express = require("express");
const router = express.Router();
const {
  getUserTransactions,
  deposit,
  withdraw,
  getBalance,
} = require("../controllers/accountController");

// Get particular user transactions
router.get("/:userId/transactions", getUserTransactions);

// Deposit
router.post("/:userId/deposit", deposit);

// Withdraw
router.post("/:userId/withdraw", withdraw);

// get user balance
router.get("/:userId/balance", getBalance);

module.exports = router;
