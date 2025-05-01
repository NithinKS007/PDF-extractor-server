import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app.error";
import { AuthMessages } from "../utils/http.status.messages";
import { StatusCodes } from "../utils/http.status.codes";
import { authenticateAccessToken } from "../controllers/jwt.controllet";
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

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
    req.user = decoded;
    next();
  } catch (error: any) {
    console.log(`Error in authentication middleware${error} `);
    next(new AppError(AuthMessages.NO_ACCESSTOKEN, StatusCodes.UNAUTHORIZED));
    return
  }
};
