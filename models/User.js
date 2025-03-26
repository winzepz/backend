const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [3, "Full name must be at least 3 characters long"],
      maxlength: [100, "Full name can be a maximum of 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      immutable: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: (v) => /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v),
        message: "Password must contain at least one uppercase letter, one number, and one special character",
      },
    },
    bio: {
      type: String,
      minlength: [50, "Bio must be at least 50 characters"],
      maxlength: [2000, "Bio can be a maximum of 2000 characters"],
      required: [true, "Bio is required"],
    },
    preferences: {
      type: [String],
      validate: [
        (array) => array.length >= 1 && array.length <= 5,
        "User must select between 1 and 5 preferences",
      ],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "experienced"],
      required: [true, "Experience level is required"],
    },
    termsAgreed: {
      type: Boolean,
      required: [true, "You must agree to the terms and conditions"],
      validate: {
        validator: (v) => v === true,
        message: "You must agree to the terms and conditions",
      },
    },
    newsletterUpdates: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
