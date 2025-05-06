const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const asyncHandler = require('express-async-handler');
const generateUniqueUserId = require('../utils/generateUserId');

// Step 1 Validation
const step1ValidationSchema = Joi.object({
  fullname: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Full name must be at least 3 characters long',
    'string.max': 'Full name can be a maximum of 100 characters',
    'any.required': 'Full name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
});

// Step 2 Validation
const step2ValidationSchema = Joi.object({
  bio: Joi.string().min(50).max(2000).required().messages({
    'string.min': 'Bio must be at least 50 characters long',
    'string.max': 'Bio can be a maximum of 2000 characters',
    'any.required': 'Bio is required',
  }),
  portfolioURL: Joi.string()
    .uri({ allowRelative: true })
    .pattern(/^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/)
    .optional()
    .messages({
      'string.uri': 'Portfolio URL must be a valid URL or domain name (e.g., facebook.com)',
      'string.pattern.base': 'Portfolio URL must be a valid domain (e.g., facebook.com)',
    }),
  newsletterUpdates: Joi.boolean().optional().default(false).messages({
    'boolean.base': 'Newsletter Updates must be a boolean value',
  }),
  termsAgreed: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must agree to the terms and conditions',
    'any.required': 'You must agree to the terms and conditions',
  }),
});

// Step 3 Validation
const step3ValidationSchema = Joi.object({
  preferences: Joi.array().items(Joi.string()).min(1).max(5).required().messages({
    'array.min': 'Please select between 1 and 5 preferences',
    'array.max': 'You can only select up to 5 preferences',
    'any.required': 'Preferences are required',
  }),
  experienceLevel: Joi.string().valid('beginner', 'intermediate', 'experienced').required().messages({
    'any.only': 'Experience level must be one of: beginner, intermediate, experienced',
    'any.required': 'Experience level is required',
  }),
});

// Step 1 Handler
const registerStep1 = async (req, res) => {
  const { error } = step1ValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map(err => err.message),
    });
  }

  const { email } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists with this email" });
  }

  req.session.step1Data = req.body;
  res.status(200).json({ message: "Step 1 data stored in session" });
};

// Step 2 Handler
const registerStep2 = async (req, res) => {
  const { error } = step2ValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details,
    });
  }

  req.session.step2Data = req.body;
  res.status(200).json({ message: "Step 2 data stored in session" });
};

// Step 3 Handler
const registerStep3 = async (req, res) => {
  const { error } = step3ValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details,
    });
  }

  req.session.step3Data = req.body;

  // All steps completed, send confirmation
  res.status(200).json({ message: "Step 3 data stored. Ready to register the user." });
};

// Final Registration - Create User and Clear Session
const finalizeRegistration = async (req, res) => {
  const { step1Data, step2Data, step3Data } = req.session;

  if (!step1Data || !step2Data || !step3Data) {
    return res.status(400).json({ message: "Incomplete registration steps" });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email: step1Data.email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const userId = await generateUniqueUserId();
    
    // Create the user
    const user = new User({
      userId,
      fullName: step1Data.fullname,
      email: step1Data.email,
      password: step1Data.password, 
      bio: step2Data.bio,
      portfolioURL: step2Data.portfolioURL,
      newsletterUpdates: step2Data.newsletterUpdates,
      termsAgreed: step2Data.termsAgreed,
      preferences: step3Data.preferences,
      experienceLevel: step3Data.experienceLevel,
      role: "author", 
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Clear session after final registration
    req.session.destroy();
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login Handler
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Session Destroy Handler
const destroyRegistrationSession = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Failed to destroy session:", err);
      return res.status(500).json({ message: "Failed to clear session" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Registration session cleared" });
  });
};

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // req.user.id is populated from the JWT token
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = {
      UserId: user.userId,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
      portfolioURL: user.portfolioURL,
      preferences: user.preferences,
      experienceLevel: user.experienceLevel,
    };

    res.status(200).json({ message: "User profile fetched successfully", profile: userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user profile", error });
  }
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, bio, portfolioURL, preferences, experienceLevel } = req.body;

  try {
    const user = await User.findById(req.user.id); // req.user.id comes from the JWT token
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the fields that are allowed
    if (fullName) user.fullName = fullName;
    if (bio) user.bio = bio;
    if (portfolioURL) user.portfolioURL = portfolioURL;
    if (preferences) user.preferences = preferences;
    if (experienceLevel) user.experienceLevel = experienceLevel;

    await user.save();  // Save the updated user

    res.status(200).json({ message: "User profile updated successfully", profile: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user profile", error });
  }
});

module.exports = {
  registerStep1,
  registerStep2,
  registerStep3,
  finalizeRegistration, 
  loginUser,
  destroyRegistrationSession,
  getUserProfile,
  updateUserProfile
};
