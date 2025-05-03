import multer from "multer";
import { Request } from "express";
import { AppError } from "./app.error";
import { StatusCodes } from "./http.status.codes";
import { CloudinaryMessage } from "./http.status.messages";

const fileFilter = async (
  req: Request,
  file: Express.Multer.File,
  cb: Function
) => {
  try {
    const isPdf = await validatePdf(file);
    if (!isPdf) {
      return cb(
        new AppError(CloudinaryMessage.PdfOnlyAllowed, StatusCodes.BAD_REQUEST),
        false
      );
    }
    cb(null, true);
  } catch (error) {
    cb(error, false);
  }
};
const validatePdf = async (file: Express.Multer.File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (file.mimetype === "application/pdf") {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

export default upload;
