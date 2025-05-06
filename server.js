const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes"); 
const adminRoutes = require('./routes/adminRoutes');
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();
connectDB();

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));


app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use('/api/admin', adminRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
