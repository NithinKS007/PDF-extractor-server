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

/*
   Environment variables
*/
const jwtSecret = process.env.JWT_SECRET!;
const jwtExpiration = process.env.JWT_EXPIRATION!;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
const jwtRefreshExpiration = process.env.JWT_REFRESH_EXPIRATION!;

/*  
    Purpose: Validates the existence of required JWT environment variables
    Throws: AppError if any required environment variables are missing
*/
const validateEnv = (): void => {
  if (
    !jwtSecret ||
    !jwtExpiration ||
    !jwtRefreshSecret ||
    !jwtRefreshExpiration
  ) {
    throw new AppError(
      EnvironmentVariableMessages.MISSING_JWT_ENVIRONMENT_VARIABLES,
      StatusCodes.BAD_REQUEST
    );
  }
};

/*  
    Purpose: Generates an Access Token using the provided payload
    Incoming: { userId, email } (payload)
    Returns: { accessToken } (JWT token)
*/
const generateAccessToken = (payload: TokenPayload): string => {
  validateEnv();
  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiration as ms.StringValue,
  });
};

/*  
    Purpose: Generates a Refresh Token using the provided payload
    Incoming: { userId, email } (payload)
    Returns: { refreshToken } (JWT token)
*/
const generateRefreshToken = (payload: TokenPayload): string => {
  validateEnv();
  return jwt.sign(payload, jwtRefreshSecret, {
    expiresIn: jwtRefreshExpiration as ms.StringValue,
  });
};

/*  
    Purpose: Verifies and decodes an Access Token
    Incoming: { token } (JWT access token)
    Returns: { userId, email } (decoded payload)
    Throws: AppError if the token is invalid or expired
*/
const authenticateAccessToken = (token: string): TokenPayload => {
  validateEnv();
  return jwt.verify(token, jwtSecret) as TokenPayload;
};

/*  
    Purpose: Verifies and decodes a Refresh Token
    Incoming: { token } (JWT refresh token)
    Returns: { userId, email } (decoded payload)
    Throws: AppError if the token is invalid or expired
*/
const authenticateRefreshToken = (token: string): TokenPayload => {
  validateEnv();
  return jwt.verify(token, jwtRefreshSecret) as TokenPayload;
};

/*  
    Route: POST api/v1/auth/refresh-access-token
    Purpose: Refreshes the access token using the provided refresh token
    Incoming: { refreshToken } (cookie)
    Returns: { newAccessToken } (newly generated JWT access token)
*/

const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
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
