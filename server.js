const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

// Use the error handler middleware
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
