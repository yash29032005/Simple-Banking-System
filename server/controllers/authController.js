const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

/* ------------------------- LOGIN ------------------------- */
exports.login = async (req, res) => {
  try {
    const { email, role, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM Users WHERE email = ? && role = ?",
      [email, role]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: `${role} not found` });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    // ⭐ This is the IMPORTANT line
    res.setHeader("Authorization", `Bearer ${token}`);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ------------------------- REGISTER ------------------------- */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const [exists] = await pool.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);

    if (exists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO Users (name, email, role, password) VALUES (?,?,?,?)",
      [name, email, "customer", hashed]
    );

    const user = {
      id: result.insertId,
      name,
      email,
      role: "customer",
    };

    return res.status(201).json({
      message: "User registered",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ------------------------- LOGOUT ------------------------- */
exports.logout = async (req, res) => {
  return res.status(200).json({
    message: "Logged out. Frontend should delete token.",
  });
};
