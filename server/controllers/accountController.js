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
    const userId = req.params.userId;
    const { amount } = req.body;

    if (amount <= 0)
      return res.status(400).json({ message: "Amount must be greater than 0" });

    await connection.beginTransaction();

    // get last balance
    const [last] = await connection.query(
      "SELECT balance FROM Accounts WHERE user_id = ? ORDER BY id DESC LIMIT 1",
      [userId]
    );

    const previousBalance = last.length ? last[0].balance : 0;
    const newBalance = previousBalance + amount;

    const account_no = generateAccountNo();

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
    console.log("Deposit error:", err);
    await connection.rollback();
    res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

exports.withdraw = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.params.userId;
    const { amount } = req.body;

    if (amount <= 0)
      return res.status(400).json({ message: "Amount must be greater than 0" });

    await connection.beginTransaction();

    // get last balance
    const [last] = await connection.query(
      "SELECT balance FROM Accounts WHERE user_id = ? ORDER BY id DESC LIMIT 1",
      [userId]
    );

    const previousBalance = last.length ? last[0].balance : 0;

    if (previousBalance < amount) {
      await connection.rollback();
      return res.status(400).json({ message: "Insufficient funds" });
    }

    const newBalance = previousBalance - amount;
    const account_no = generateAccountNo();

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
    const { userId } = req.params;

    const [rows] = await pool.query(
      "SELECT balance FROM Accounts WHERE user_id = ? ORDER BY id DESC LIMIT 1",
      [userId]
    );

    const balance = rows.length ? rows[0].balance : 0;

    res.json({ balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
