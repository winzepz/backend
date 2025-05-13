const mongoose = require('mongoose');
const validator = require('validator');

const deletedUserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
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
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      minlength: [50, "Bio must be at least 50 characters"],
      maxlength: [2000, "Bio can be a maximum of 2000 characters"],
    },
    preferences: {
      type: [String],
      required: true,
      validate: [(v) => v.length >= 1 && v.length <= 5, "User must select between 1 and 5 preferences"],
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
    portfolioURL: {
      type: String,
      validate: {
        validator: function(value) {
          if (value && value.length > 0) {
            return validator.isURL(value, { require_protocol: false });
          }
          return true;
        },
        message: "Portfolio URL must be valid (example.com or www.example.com)",
      },
      required: false,
    },
    newsletterUpdates: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "author"],
      default: "author",
    },
    deletedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DeletedUser', deletedUserSchema);
