import { AppError } from "../utils/app.error";
import { StatusCodes } from "../utils/http.status.codes";
import { ErrorMessages } from "../utils/http.status.messages";
import { sendResponse } from "../utils/send.response";
import { NextFunction, Request, Response } from "express";

/*  
    Middleware: errorMiddleware
    Purpose: Catches errors and sends a response to the client.
    Incoming: Error details (err), request (req), response (res), and next (next).
    Returns: Sends an error response with the appropriate status code and message.
*/
export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
):void => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || ErrorMessages.INTERNAL_SERVER_ERROR;
  console.log("Error details:", {
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method,
  });
  sendResponse(res, statusCode, null, message);
  next();
};
