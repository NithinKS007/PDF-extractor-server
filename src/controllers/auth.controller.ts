import { Request, Response } from "express";
import userModel from "../models/user.model";
import { sendResponse } from "../utils/send.response";
import { StatusCodes } from "../utils/http.status.codes";
import { AuthMessages } from "../utils/http.status.messages";
import { comparePassword, hashPassword } from "../utils/hash.password";
import { AppError } from "../utils/app.error";
import { generateAccessToken, generateRefreshToken } from "./jwt.controller";

/*  
    Route: POST api/v1/auth/sign-up
    Purpose:  User sign-up - Register a new user with provided name, email, and password
    Incoming: { name, email, password } (body)
    Returns: { createdUser } (user data), message (success message)
*/
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, name, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError(
      AuthMessages.ALL_FIELDS_ARE_REQUIRED,
      StatusCodes.BAD_REQUEST
    );
  }

  const existingEmail = await userModel.findOne({ email: email });

  if (existingEmail) {
    throw new AppError(AuthMessages.EMAIL_CONFLICT, StatusCodes.BAD_REQUEST);
  }

  const hashedPassword = await hashPassword(password);
  const createdUser = await userModel.create({
    email,
    name,
    password: hashedPassword,
  });

  sendResponse(
    res,
    StatusCodes.OK,
    { createdUser: createdUser },
    AuthMessages.USER_CREATED_SUCCESSFULLY
  );
};

/*  
    Route: POST api/v1/auth/sign-in
    Purpose: User sign-in - Authenticate and generate access and refresh tokens
    Incoming: { email, password } (body)
    Returns: { userData, accessToken } (user data without password and access token), message (success message)
*/

export const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password: bodyPassword } = req.body;

  const userData = await userModel.findOne({ email });

  if (!userData) {
    throw new AppError(AuthMessages.USER_NOT_FOUND, StatusCodes.BAD_REQUEST);
  }
  const { password, ...userWithoutPassword } = userData.toObject();

  const isValidPassword = await comparePassword(bodyPassword, password);

  if (!isValidPassword) {
    throw new AppError(
      AuthMessages.INCORRECT_PASSWORD,
      StatusCodes.BAD_REQUEST
    );
  }

  const accessToken = generateAccessToken({
    userId: userWithoutPassword?._id.toString(),
    email: userWithoutPassword?.email,
  });
  const refreshToken = generateRefreshToken({
    userId: userWithoutPassword?._id.toString(),
    email: userWithoutPassword?.email,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "PRODUCTION",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(
    res,
    StatusCodes.OK,
    { userData: userWithoutPassword, accessToken: accessToken },
    AuthMessages.LOGGEDIN_SUCCESS
  );
};

/*  
    Route: POST api/v1/auth/sign-out
    Purpose: User sign-out - Clear refresh token cookie
    Incoming: None (cookies)
    Returns: message (logout success message)
*/

export const signout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "PRODUCTION",
  });
  sendResponse(res, StatusCodes.OK, null, AuthMessages.LOGOUTSUCCESSFUL);
};
