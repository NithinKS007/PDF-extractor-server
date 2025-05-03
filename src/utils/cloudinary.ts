import { PdfUpload } from "../types/cloudinary";
import cloudinary from "../config/cloudinary.config";
import { UploadApiResponse } from "cloudinary";
import { AppError } from "./app.error";
import { CloudinaryMessage } from "./http.status.messages";
import { StatusCodes } from "./http.status.codes";
import { Readable } from "stream";
import https from "https";

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
              CloudinaryMessage.FailedToUpload,
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
        CloudinaryMessage.FailedToUpload,
        StatusCodes.BAD_REQUEST
      );
    }

    return { url, publicId };
  } catch (error: any) {
    throw new AppError(
      error.message || CloudinaryMessage.FailedToUpload,
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const downloadPdfFromCloudinary = async (secureUrl: string) => {
  try {
    return new Promise<Buffer>((resolve, reject) => {
      https.get(secureUrl, (response) => {
        if (response.statusCode !== 200) {
          return reject(
            new AppError(
              CloudinaryMessage.FailedToGetPdfData,
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
      error.message || CloudinaryMessage.FailedToGetPdfData,
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
export default uploadPdf;
