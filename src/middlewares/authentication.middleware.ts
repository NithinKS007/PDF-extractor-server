import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app.error";
import { AuthMessages } from "../utils/http.status.messages";
import { StatusCodes } from "../utils/http.status.codes";
import { authenticateAccessToken } from "../controllers/jwt.controller";
import { TokenPayload } from "../types/jwt.payload";

/*  
    Middleware: authenticate
    Purpose: Verifies if the user is authenticated by checking the provided access token in the Authorization header.
    Incoming: { Authorization: 'Bearer <accessToken>' } (authorization header)
    Returns: If the token is valid, the request proceeds; otherwise, an error is thrown.
*/
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];

  console.log("auth header", authHeader, req.headers);
  if (!authHeader) {
    next(
      new AppError(AuthMessages.AUTHENTICATION_HEADER, StatusCodes.UNAUTHORIZED)
    );
    return;
  }
  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    next(new AppError(AuthMessages.NO_ACCESSTOKEN, StatusCodes.UNAUTHORIZED));
    return;
  }

  try {
    const decoded = authenticateAccessToken(accessToken);
    req.user = decoded as TokenPayload;
    next();
  } catch (error: any) {
    console.log(`Error in authentication middleware${error} `);
    next(new AppError(AuthMessages.NO_ACCESSTOKEN, StatusCodes.UNAUTHORIZED));
    return;
  }
};
