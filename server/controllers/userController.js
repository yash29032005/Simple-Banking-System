const pool = require("../config/db");

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        COALESCE((
          SELECT balance 
          FROM Accounts 
          WHERE user_id = u.id 
          ORDER BY id DESC 
          LIMIT 1
        ), 0) AS balance
      FROM Users u
      ORDER BY u.id DESC
    `);

    return res.status(200).json({
      users: rows,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
