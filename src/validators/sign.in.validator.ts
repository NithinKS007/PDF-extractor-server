import { body } from "express-validator";

/*  
    Validator: signinValidator
    Purpose: Validates the input fields for user sign-in.
    - email: Ensures the email field is not empty, is a valid email format, and normalizes the email.
    - password: Ensures the password field is not empty.
    Returns: An array of validation rules to be used in the request validation chain.
*/
export const signinValidator = [
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];
