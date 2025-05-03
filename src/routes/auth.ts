import express from "express";

export const auth = express.Router();
import { signup, signin, signout } from "../controllers/auth.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { signinValidator } from "../validators/sign.in.validator";
import { signupValidator } from "../validators/sign.up.validator";
import { refreshAccessToken } from "../controllers/jwt.controller";

auth.post("/sign-up", signupValidator, validationMiddleware, signup);
auth.post("/sign-in", signinValidator, validationMiddleware, signin);
auth.post("/refresh-access-token", refreshAccessToken);
auth.post("/sign-out", signout);
