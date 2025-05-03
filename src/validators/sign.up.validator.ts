import { body } from "express-validator";

/*  
    Validator: signupValidator
    Purpose: Validates the input fields for user sign-up.
    - name: Ensures the name field is not empty.
    - email: Ensures the email field is not empty, is a valid email format, and normalizes the email.
    - password: Ensures the password field is not empty.
    Returns: An array of validation rules to be used in the request validation chain.
*/
export const signupValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password").notEmpty(),
];
