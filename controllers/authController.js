const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// Step 1: Register - Validate name, email, and password
const step1ValidationSchema = Joi.object({
  fullName: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Full name must be at least 3 characters long',
    'string.max': 'Full name can be a maximum of 100 characters',
    'any.required': 'Full name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one number, and one special character',
    'any.required': 'Password is required',
  }),
});

// Step 2: Register - Validate bio, portfolioURL (optional), newsletterUpdates
const step2ValidationSchema = Joi.object({
  bio: Joi.string().min(50).max(2000).required().messages({
    'string.min': 'Bio must be at least 50 characters long',
    'string.max': 'Bio can be a maximum of 2000 characters',
    'any.required': 'Bio is required',
  }),
  portfolioURL: Joi.string()
    .uri({ allowRelative: true }) // Allow relative URLs (e.g., facebook.com)
    .pattern(/^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/) // Custom regex to allow formats like facebook.com
    .optional()
    .messages({
      'string.uri': 'Portfolio URL must be a valid URL or domain name (e.g., facebook.com)',
      'string.pattern.base': 'Portfolio URL must be a valid domain (e.g., facebook.com)',
    }),
  newsletterUpdates: Joi.boolean().optional().default(false).messages({
    'boolean.base': 'Newsletter Updates must be a boolean value',
  }),
});



// Step 3: Register - Validate preferences, experienceLevel, termsAgreed
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
  termsAgreed: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must agree to the terms and conditions',
    'any.required': 'You must agree to the terms and conditions',
  }),
});

// Step 1 Register endpoint
const registerStep1 = async (req, res, next) => {
  const { error } = step1ValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details,
    });
  }
  const { email } = req.body;

  // Check if the email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      message: "User already exists with this email",
    });
  }


  // Store step 1 data in session
  req.session.step1Data = req.body;
  res.status(200).json({
    message: "Step 1 data stored in session",
  });
};

// Step 2 Register endpoint
const registerStep2 = async (req, res, next) => {
  const { error } = step2ValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details,
    });
  }
  

  // Store step 2 data in session
  req.session.step2Data = req.body;
  res.status(200).json({
    message: "Step 2 data stored in session",
  });
};

// Step 3 Register endpoint
const registerStep3 = async (req, res, next) => {
  const { error } = step3ValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details,
    });
  }

  // All steps are valid, now proceed with final registration
  const { step1Data, step2Data } = req.session;
  const { preferences, experienceLevel, termsAgreed, } = req.body;

  try {
    const userExists = await User.findOne({ email: step1Data.email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      fullName: step1Data.fullName,
      email: step1Data.email,
      password: step1Data.password,
      bio: step2Data.bio,
      portfolioURL: step2Data.portfolioURL,
      newsletterUpdates: step2Data.newsletterUpdates,
      preferences,
      experienceLevel,
      termsAgreed,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Clear session data after successful registration
    req.session.destroy();

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login endpoint (to test after registration)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
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

module.exports = {
  registerStep1,
  registerStep2,
  registerStep3,
  loginUser,
};
