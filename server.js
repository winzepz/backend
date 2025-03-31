const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));

app.use("/api/auth", authRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
