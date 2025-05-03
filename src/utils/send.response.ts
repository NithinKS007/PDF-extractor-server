import { Response } from "express";


/*  
    Function: sendResponse
    Purpose: Sends a standardized JSON response to the client.
    Incoming: 
      - res: The response object from Express.
      - statusCode: The HTTP status code to be sent.
      - data: The data to be included in the response body.
      - message: A message providing more context for the response.
    Returns: A JSON response with the following structure:
      {
        success: boolean,  // true if statusCode is 2xx, false otherwise
        status: number,    // HTTP status code
        message: string,   // A descriptive message
        data: any          // The data being returned in the response
    */
export const sendResponse = (
  res: Response,
  statusCode: number,
  data: any,
  message: string
) => {
  const success = statusCode >= 200 && statusCode < 300;
  const response = {
    success,
    status: statusCode,
    message: message,
    data,
  };
  return res.status(statusCode).json(response);
};
