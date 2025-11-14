const pool = require("../config/db");

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
      u.id,
      u.name,
      u.email,
      u.role,
      COALESCE(last_balance.balance, 0) AS balance
      FROM Users u
      LEFT JOIN (
          SELECT user_id, balance 
          FROM Accounts 
          ORDER BY id DESC
      ) AS last_balance ON last_balance.user_id = u.id
      WHERE u.role = 'customer'
      GROUP BY u.id
      ORDER BY u.id DESC;
    `);

    return res.status(200).json({
      users: rows,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
