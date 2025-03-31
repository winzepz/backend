const express = require("express");
const {
  registerStep1,
  registerStep2,
  registerStep3,
  loginUser,
} = require("../controllers/authController");

const router = express.Router();

// Register steps
router.post("/register/step1", registerStep1);
router.post("/register/step2", registerStep2);
router.post("/register/step3", registerStep3);

// Login route
router.post("/login", loginUser);

router.get('/meowmeow', (req, res) => {
    res.json({ message: 'Meow' });
  });

module.exports = router;
