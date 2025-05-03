import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { EnvironmentVariableMessages } from "../utils/http.status.messages";
import { AppError } from "../utils/app.error";
import { StatusCodes } from "../utils/http.status.codes";
dotenv.config();
/* 
  Define an interface for Cloudinary credentials that should be present in the environment variables.
*/
interface CloudinaryConfig {
  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env as unknown as CloudinaryConfig;

/* 
  If any of the Cloudinary credentials are missing,
  throw an error with a message indicating the missing credentials and a BAD_REQUEST status.
*/
if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new AppError(
    EnvironmentVariableMessages.MISSING_CLOUDINARY_CREDENTIALS,
    StatusCodes.BAD_REQUEST
  );
}

/* 
  Configure the Cloudinary SDK with the credentials obtained from the environment variables.
  This setup is necessary for interacting with the Cloudinary service.
*/

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;
