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
  MissingCloudinaryCredentials = "Missing required cloudinary environment variables",
  MissingJwtEnvironmentVariables = "Missing required jwt environment variables",
}

export enum CloudinaryMessage {
  FailedToUpload = "Failed to upload to cloudinary",
  PdfOnlyAllowed = "Only PDF files are allowed",
  NoFileToUpload = "No file uploaded",
  PdfUploadSuccess = "Pdf uploaded successfully",
  FailedToGetPdfData = "Failed to retrieve PDF data. Please try again later.",
  PdfExtractSuccess= "Pdf extracted successfully"
}

export enum PdfMessages {
  FailedToRetrievePdfList = "Failed to retrieve user pdfs",
  FailedToRetrievePdfData = "Failed to retrieve pdf data",
  PdfDataRetrievedSuccess = "Pdf data retrieved successfully",
}
