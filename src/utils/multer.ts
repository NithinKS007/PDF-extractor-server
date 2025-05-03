import multer from "multer";
import { Request } from "express";
import { AppError } from "./app.error";
import { StatusCodes } from "./http.status.codes";
import { CloudinaryMessage } from "./http.status.messages";

/*  
    Function: fileFilter
    Purpose: Filters the uploaded files to allow only PDF files.
    Incoming: { req: Request, file: Express.Multer.File, cb: Function }
    - req: The incoming request object.
    - file: The file object uploaded by the user.
    - cb: The callback function to be called with the result.
    Returns: A promise that resolves to `true` if the file is a PDF and `false` if it's not.
    Throws: An error if validation fails (non-PDF file).
*/
const fileFilter = async (
  req: Request,
  file: Express.Multer.File,
  cb: Function
): Promise<void> => {
  try {
    const isPdf = await validatePdf(file);
    if (!isPdf) {
      return cb(
        new AppError(
          CloudinaryMessage.PDF_ONLY_ALLOWED,
          StatusCodes.BAD_REQUEST
        ),
        false
      );
    }
    cb(null, true);
  } catch (error) {
    cb(error, false);
  }
};

/*  
    Function: validatePdf
    Purpose: Validates if the uploaded file is a PDF by checking its mimetype.
    Incoming: { file: Express.Multer.File }
    - file: The file object uploaded by the user.
    Returns: A boolean value wrapped in a promise.
    - true if the file is a PDF.
    - false if the file is not a PDF.
*/
const validatePdf = async (file: Express.Multer.File): Promise<boolean> => {
  return file.mimetype === "application/pdf";
};

/*  
    Function: upload
    Purpose: Configures the multer middleware to handle file uploads with memory storage and file filters.
    Incoming: None
    Returns: A multer instance configured with storage, file filter, and file size limits.
    - File size limit is set to 100MB.
*/
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

export default upload;
