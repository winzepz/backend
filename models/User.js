const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
                const urlPattern = /^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
                return urlPattern.test(value);
              }
              return true; // No validation if the URL is empty
            },
            message: "Portfolio URL must be a valid URL or domain name (e.g., facebook.com)",
          },
          required: false, // Optional field
        },
        newsletterUpdates: {
          type: Boolean,
          default: false, // Default value
        },
        role: { type: String,
          enum: ["admin", "author"], 
          default: "author" },
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
