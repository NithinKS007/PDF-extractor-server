import express from "express";
import { signup, signin, signout } from "../controllers/auth.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { signinValidator } from "../validators/sign.in.validator";
import { signupValidator } from "../validators/sign.up.validator";
import { refreshAccessToken } from "../controllers/jwt.controller";

/*  
    Route: api/v1/auth/
    Purpose: User authentication routes
*/

export const auth = express.Router();
auth.post("/sign-up", signupValidator, validationMiddleware, signup);
auth.post("/sign-in", signinValidator, validationMiddleware, signin);
auth.post("/refresh-access-token", refreshAccessToken);
auth.post("/sign-out", signout);
