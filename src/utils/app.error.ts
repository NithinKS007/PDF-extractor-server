/*  
    Custom error class that extends the built-in Error class. 
    This class is used to create errors with additional properties, such as a status code and error message.
*/
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
