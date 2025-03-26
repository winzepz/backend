// const Joi = require("joi");

// const registerSchema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().min(6).required(),
//     bio: Joi.string().min(50).max(2000).required(),
//     preferences: Joi.array().items(Joi.string()).min(1).max(5).required(),
//     experienceLevel: Joi.string().valid("beginner", "intermediate", "experienced").required(),
//     termsAndConditions: Joi.boolean().valid(true).required().messages({
//         "any.only": "You must agree to the terms and conditions.",
//     }),
//     newsletterUpdates: Joi.boolean().optional(),
// });

// const loginSchema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
// });

// // Example for future validations
// const validateEmail = (email) => {
//     const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return regex.test(email);
// };


// module.exports = { validateEmail, registerSchema, loginSchema };
