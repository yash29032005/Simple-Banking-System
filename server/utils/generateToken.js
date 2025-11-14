const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "customer",
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};
