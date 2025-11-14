const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");

// Login
router.post("/login", login);

// Register
router.post("/register", register);

// Logout
router.post("/logout", logout);

module.exports = router;
