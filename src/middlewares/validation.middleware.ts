import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../utils/app.error";
import { StatusCodes } from "../utils/http.status.codes";

/*  
    Middleware: validationMiddleware
    Purpose: Validates request input using express-validator
    Incoming: Request object (req), Response object (res), Next function (next)
    Returns: If validation fails, an error response is sent with all validation error messages.
*/
export const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
):void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new AppError(
        errors
          .array()
          .map((err) => err.msg)
          .join(", "),
        StatusCodes.BAD_REQUEST
      )
    );
  }
  next();
};
