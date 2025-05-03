import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import ms from "ms";
import dotenv from "dotenv";
import { AppError } from "../utils/app.error";
import {
  AuthMessages,
  EnvironmentVariableMessages,
} from "../utils/http.status.messages";
import { TokenPayload } from "../types/jwt.payload";
import { StatusCodes } from "../utils/http.status.codes";
import { sendResponse } from "../utils/send.response";
dotenv.config();

// Environment variables
const jwtSecret = process.env.JWT_SECRET!;
const jwtExpiration = process.env.JWT_EXPIRATION!;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
const jwtRefreshExpiration = process.env.JWT_REFRESH_EXPIRATION!;

const validateEnv = (): void => {
  if (
    !jwtSecret ||
    !jwtExpiration ||
    !jwtRefreshSecret ||
    !jwtRefreshExpiration
  ) {
    throw new AppError(
      EnvironmentVariableMessages.MissingJwtEnvironmentVariables,
      StatusCodes.BAD_REQUEST
    );
  }
};

// Function to generate Access Token
const generateAccessToken = (payload: TokenPayload): string => {
  validateEnv();
  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiration as ms.StringValue,
  });
};

// Function to generate Refresh Token
const generateRefreshToken = (payload: TokenPayload): string => {
  validateEnv();
  return jwt.sign(payload, jwtRefreshSecret, {
    expiresIn: jwtRefreshExpiration as ms.StringValue,
  });
};

// Function to authenticate Access Token
const authenticateAccessToken = (token: string): TokenPayload => {
  validateEnv();
  return jwt.verify(token, jwtSecret) as TokenPayload;
};

// Function to authenticate Refresh Token
const authenticateRefreshToken = (token: string): TokenPayload => {
  validateEnv();
  return jwt.verify(token, jwtRefreshSecret) as TokenPayload;
};

/*  
    Route: POST api/v1/auth/refresh-access-token
    Purpose: user refresh access token after expiration
*/

const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req?.cookies?.refreshToken;

  if (!refreshToken) {
    throw new AppError(AuthMessages.NO_REFRESH_TOKEN, StatusCodes.FORBIDDEN);
  }

  const decoded = authenticateRefreshToken(refreshToken);

  const { userId, email } = decoded;
  const newAccessToken = generateAccessToken({ userId, email });
  sendResponse(
    res,
    StatusCodes.OK,
    { newAccessToken },
    AuthMessages.ACCESS_TOKEN_REFRESHED_SUCCESSFULLY
  );
};

export {
  generateAccessToken,
  generateRefreshToken,
  authenticateAccessToken,
  authenticateRefreshToken,
  refreshAccessToken,
};
