const express = require("express");
const router = express.Router();

const { getAllUsers } = require("../controllers/userController");

// Banker can view all customers
router.get("/users", getAllUsers);

module.exports = router;
