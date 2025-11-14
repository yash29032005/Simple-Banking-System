const pool = require("../config/db");
const { generateAccountNo } = require("../utils/generateAccountNo");

exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [rows] = await pool.query(
      "SELECT * FROM Accounts WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json({ transactions: rows });
  } catch (err) {
    console.log("Error fetching transactions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deposit = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.params.userId;
    const { amount } = req.body;

    if (amount <= 0)
      return res.status(400).json({ message: "Amount must be greater than 0" });

    // --- 1. Reuse existing account number ---
    const [[acc]] = await connection.query(
      "SELECT account_no FROM Accounts WHERE user_id = ? ORDER BY id ASC LIMIT 1",
      [userId]
    );

    const account_no = acc ? acc.account_no : generateAccountNo();

    // --- 2. Get last balance ---
    const [last] = await connection.query(
      "SELECT balance FROM Accounts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    const previousBalance = last.length ? Number(last[0].balance) : 0;
    const newBalance = previousBalance + Number(amount);

    // --- 3. Insert the transaction ---
    await connection.query(
      "INSERT INTO Accounts (account_no, user_id, amount, type, balance) VALUES (?,?,?,?,?)",
      [account_no, userId, amount, "deposit", newBalance]
    );

    await connection.commit();

    res.json({
      message: "Deposit successful",
      balance: newBalance,
    });
  } catch (err) {
    console.error("Deposit error:", err);
    await connection.rollback();
    res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

exports.withdraw = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const userId = req.params.userId;
    const { amount } = req.body;

    if (amount <= 0)
      return res.status(400).json({ message: "Amount must be greater than 0" });

    // --- 1. Reuse the same account number ---
    const [[acc]] = await connection.query(
      "SELECT account_no FROM Accounts WHERE user_id = ? ORDER BY id ASC LIMIT 1",
      [userId]
    );

    const account_no = acc ? acc.account_no : generateAccountNo();

    // --- 2. Get last balance ---
    const [last] = await connection.query(
      "SELECT balance FROM Accounts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    const previousBalance = last.length ? Number(last[0].balance) : 0;

    if (previousBalance < amount) {
      await connection.rollback();
      return res.status(400).json({ message: "Insufficient funds" });
    }

    const newBalance = previousBalance - Number(amount);

    // --- 3. Insert withdraw transaction ---
    await connection.query(
      "INSERT INTO Accounts (account_no, user_id, amount, type, balance) VALUES (?,?,?,?,?)",
      [account_no, userId, amount, "withdraw", newBalance]
    );

    await connection.commit();

    res.json({
      message: "Withdrawal successful",
      balance: newBalance,
    });
  } catch (err) {
    console.log("Withdraw error:", err);
    await connection.rollback();
    res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

exports.getBalance = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [rows] = await pool.query(
      "SELECT balance FROM Accounts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    res.json({ balance: rows.length ? rows[0].balance : 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
