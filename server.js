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
// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));



// Session Middleware
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false, // Set to false for better security
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      httpOnly: true, // Prevents XSS attacks
      sameSite: "lax", // Adjust based on your needs
    },
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
