export enum AuthMessages {
  ALL_FIELDS_ARE_REQUIRED = "All fields are required.",
  EMAIL_CONFLICT = "The email address you entered already exists in our system.",
  FAILED_TO_HASH_PASSWORD = "Failed to hash password.",
  FAILED_TO_COMPARE_PASSWORD = "Failed to compare password.",
  USER_CREATED_SUCCESSFULLY = "Your account has been created successfully.",
  USER_NOT_FOUND = "Cannot find an email address with the provided email",
  INCORRECT_PASSWORD = "Incorrect password",
  LOGGEDIN_SUCCESS = "Logged in successfully",
  LOGOUTSUCCESSFUL = "Logged out successfully",
  ACCESS_TOKEN_REFRESHED_SUCCESSFULLY = "Access token refreshed successfully",
  NO_REFRESH_TOKEN = "No refresh token",
  AUTHENTICATION_HEADER = "Authentication header is missing",
  NO_ACCESSTOKEN = "No access Token",
}

export enum ErrorMessages {
  INTERNAL_SERVER_ERROR = "Internal server error. Please try again later.",
}

export enum EnvironmentVariableMessages {
  MISSING_CLOUDINARY_CREDENTIALS = "Missing required Cloudinary environment variables",
  MISSING_JWT_ENVIRONMENT_VARIABLES = "Missing required JWT environment variables",
}

export enum CloudinaryMessage {
  FAILED_TO_UPLOAD = "Failed to upload to Cloudinary",
  PDF_ONLY_ALLOWED = "Only PDF files are allowed",
  NO_FILE_TO_UPLOAD = "No file uploaded",
  PDF_UPLOAD_SUCCESS = "PDF uploaded successfully",
  FAILED_TO_GET_PDF_DATA = "Failed to retrieve PDF data. Please try again later.",
  PDF_EXTRACT_SUCCESS = "PDF extracted successfully"
}

export enum PdfMessages {
  FAILED_TO_RETRIEVE_PDF_LIST = "Failed to retrieve user PDFs",
  FAILED_TO_RETRIEVE_PDF_DATA = "Failed to retrieve PDF data",
  PDF_DATA_RETRIEVED_SUCCESS = "PDF data retrieved successfully",
}
