const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoute");
const accountRoutes = require("./routes/accountRoute");
const userRoutes = require("./routes/userRoute");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    exposedHeaders: ["Authorization"],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", accountRoutes);
app.use("/api", userRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
