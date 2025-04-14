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

router.get("/session", (req, res) => {
  // Check if any of the session step data exists
  if (req.session.step1Data || req.session.step2Data || req.session.step3Data) {
    return res.json({ 
      message: "Session data exists", 
      step1Data: req.session.step1Data,
      step2Data: req.session.step2Data,
      step3Data: req.session.step3Data,
    });
  } else {
    return res.status(404).json({ message: "Session data not found" }); // Session data not found
  }
});



router.get("/meowmeow", (req, res) => {
  res.json({ message: "Meow" });
});

module.exports = router;
