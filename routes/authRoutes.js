const express = require("express");
const {
  registerStep1,
  registerStep2,
  registerStep3,
  finalizeRegistration,
  loginUser,
  destroyRegistrationSession,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register/step1", registerStep1);
router.post("/register/step2", registerStep2);
router.post("/register/step3", registerStep3);
router.post("/register/finalize", finalizeRegistration); 
router.post("/login", loginUser);

// Destroy session route
router.get("/register/destroy-session", destroyRegistrationSession);

// Optional session check route
router.get("/session", (req, res) => {
  if (req.session.step1Data || req.session.step2Data || req.session.step3Data) {
    return res.json({
      message: "Session data exists",
      step1Data: req.session.step1Data,
      step2Data: req.session.step2Data,
      step3Data: req.session.step3Data,
    });
  } else {
    return res.status(200).json({ message: "Session data not found" });
  }
});

// Just a test route
router.get("/meowmeow", (req, res) => {
  res.json({ message: "Meow" });
});

module.exports = router;
