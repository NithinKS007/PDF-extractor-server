import { PdfUpload } from "../types/cloudinary";
import cloudinary from "../config/cloudinary.config";
import { UploadApiResponse } from "cloudinary";
import { AppError } from "./app.error";
import { CloudinaryMessage } from "./http.status.messages";
import { StatusCodes } from "./http.status.codes";
import { Readable } from "stream";
import https from "https";

/*  
    Function: uploadToCloudinary
    Purpose: Uploads a file to Cloudinary using a stream and returns the upload result.
    Incoming: { buffer: <Buffer>, options: { resource_type: "auto", folder: <string> } } (buffer and upload options)
    Returns: Resolves with the upload result; throws an error if upload fails.
*/
const uploadToCloudinary = (
  buffer: Buffer,
  options: { resource_type: "auto"; folder: string }
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(
            new AppError(
              CloudinaryMessage.FAILED_TO_UPLOAD,
              StatusCodes.BAD_REQUEST
            )
          );
        }
      }
    );
    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
};

/*  
    Function: uploadPdf
    Purpose: Uploads a PDF to Cloudinary and returns the URL and public ID of the uploaded file.
    Incoming: { pdf: <Buffer>, folder: <string> } (PDF file and folder to store)
    Returns: { url: string, publicId: string } (the uploaded file's URL and public ID)
*/
const uploadPdf = async (
  uploadImage: PdfUpload
): Promise<{ url: string; publicId: string }> => {
  const { pdf, folder } = uploadImage;
  const uploadOptions: { resource_type: "auto"; folder: string } = {
    resource_type: "auto",
    folder,
  };

  try {
    const result: UploadApiResponse = await uploadToCloudinary(
      pdf,
      uploadOptions
    );
    const url = result.secure_url;
    const publicId = result.public_id;
    if (!url) {
      throw new AppError(
        CloudinaryMessage.FAILED_TO_UPLOAD,
        StatusCodes.BAD_REQUEST
      );
    }

    return { url, publicId };
  } catch (error: any) {
    throw new AppError(
      error.message || CloudinaryMessage.FAILED_TO_UPLOAD,
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/*  
    Function: downloadPdfFromCloudinary
    Purpose: Downloads a PDF file from Cloudinary using its secure URL.
    Incoming: { secureUrl: string } (the secure URL of the file)
    Returns: Resolves with the file content as a Buffer; throws an error if download fails.
*/

export const downloadPdfFromCloudinary = async (
  secureUrl: string
): Promise<Buffer> => {
  try {
    return new Promise<Buffer>((resolve, reject) => {
      https.get(secureUrl, (response) => {
        if (response.statusCode !== 200) {
          return reject(
            new AppError(
              CloudinaryMessage.FAILED_TO_GET_PDF_DATA,
              StatusCodes.BAD_REQUEST
            )
          );
        }

        const chunks: Buffer[] = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(chunks)));
        response.on("error", reject);
      });
    });
  } catch (error: any) {
    throw new AppError(
      error.message || CloudinaryMessage.FAILED_TO_GET_PDF_DATA,
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
export default uploadPdf;
