# PDF Extractor Backend Server

A Node.js/Express backend service for handling PDF uploads, storage, and page extraction operations. This service uses MongoDB for storage management and Cloudinary for cloud-based file hosting.

## 🚀 Features

- PDF file upload and storage
- Page extraction from PDF files
- Cloudinary integration for file hosting
- MongoDB integration for metadata storage
- Error handling middleware
- Validation middleware
- Secure file upload with Multer
- User authentication

## 📋 Prerequisites

- Node.js (v22.15.0 or higher)
- MongoDB installed and running
- Cloudinary account
- Git

## ⚙️ Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/PDF-extractor-server.git
cd pdf-extractor-server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Server Port
PORT=9000

# Database configuration (MongoDB Atlas or another database)
ATLAS_DATABASE_CONFIG=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority

# CORS origins that are allowed to make requests to your server (e.g., your frontend app)
CLIENT_ORIGINS=http://localhost:3000

# JWT (JSON Web Token) settings for authentication
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRATION=1h  # token expiration (e.g., 1 hour)
JWT_REFRESH_SECRET=your-refresh-token-secret-here
JWT_REFRESH_EXPIRATION=7d  # refresh token expiration (e.g., 7 days)

# Node environment (DEVELOPMENT, PRODUCTION)
NODE_ENV=DEVELOPMENT

# Cloudinary settings for image/PDF uploads
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_PDF_UPLOADING_FOLDER=pdf-uploads  # The folder on Cloudinary where PDFs will be stored

```

## 🏃‍♂️ Running the Server

Development mode:

```bash
npm run dev
```

The server will start on `http://localhost:3000` by default.

## 📁 Project Structure

```
server/
│
├── .env                    # Environment variables
├── .gitignore              # Git ignore configuration
├── package-lock.json       # Package lock for npm
├── package.json            # Project dependencies and scripts
├── README.md               # Project documentation
├── tsconfig.json           # TypeScript configuration
│
├── config/                 # Configuration files
│   ├── cloudinary.config.ts # Cloudinary configuration
│   └── db.config.ts        # Database configuration
│
├── controllers/            # Controllers for handling business logic
│   ├── auth.controller.ts  # Authentication controller
│   ├── jwt.controller.ts   # JWT controller
│   └── pdf.controller.ts   # PDF controller
│
├── middleware/             # Middleware for different processes
│   ├── authentication.middleware.ts  # Authentication checks
│   ├── error.middleware.ts          # Error handling middleware
│   └── validation.middleware.ts     # Request validation middleware
│
├── models/                 # Models for different entities
│   ├── pdf.model.ts        # PDF model
│   └── user.model.ts       # User model
│
├── routes/                 # API route definitions
│   ├── auth.routes.ts      # Authentication routes
│   └── pdf.routes.ts       # PDF routes
│
├── types/                  # TypeScript type definitions
│   ├── cloudinary.ts       # Cloudinary types
│   └── jwt.payload.ts      # JWT payload types
│
├── utils/                  # Utility functions
│   ├── app.error.ts        # App-wide error handling
│   ├── cloudinary.ts       # Cloudinary utility functions
│   ├── hash.password.ts    # Password hashing utility
│   ├── http.status.codes.ts # HTTP status codes
│   ├── http.status.messages.ts # HTTP status messages
│   ├── multer.ts           # Multer file upload utility
│   ├── send.response.ts     # Response sender utility
│
├── validators/             # Request validation logic
│   ├── sign.in.validator.ts  # Sign-in request validation
│   └── sign.up.validator.ts  # Sign-up request validation
│
├── node_modules/           # Node.js dependencies (auto-generated)
│
├── dist/                   # Compiled JavaScript files (after TypeScript transpilation)
│
├── server.ts               # Main server file
└── index.ts                # Entry point to start the server

```

## 🔗 API Endpoints

## Authentication Routes (User Auth)

# Sign-Up

POST /api/v1/auth/sign-up
Content-Type: application/json

Request Body:
{
// User signup data, validated by signupValidator
}

Response:
{
// Response after successful signup
}

# Sign-In

POST /api/v1/auth/sign-in
Content-Type: application/json

Request Body:
{
// User signin data, validated by signinValidator
}

Response:
{
// Response after successful signin
}

# Refresh Access Token

POST /api/v1/auth/refresh-access-token
Content-Type: application/json

Response:
{
// New access token
}

# Sign-Out

POST /api/v1/auth/sign-out
Content-Type: application/json

Request Body:
{
// Request data to process user logout (e.g., token revocation or session termination)
}

Response:
{
// Confirmation of sign-out
}

## PDF Routes (PDF Management)

# Upload PDF

POST /api/v1/pdf/upload
Content-Type: multipart/form-data

Request Body:
{
file: [PDF file]
}

Response:
{
// Confirmation or response with PDF metadata
}

# Retrieve PDFs

GET /api/v1/pdf/retrieve
Content-Type: application/json

Response:
{
// List of PDF files
}

# Extract Pages from PDF

POST /api/v1/pdf/extract/:pdfId
Content-Type: application/json

Request Body:
{
"pages": [1, 2, 3] // Array of page numbers to extract from the PDF
}

Response:
{
// New PDF with the extracted pages or relevant status message
}

## 💾 Database Schema

### PDF Model

```Typescript
{
  userId: ObjectId;
  fileName: string;
  publicId: string;
  pdfUrl: string;
}
```

## User Model

```Typescript
{

  name: string;
  email: string;
  password: string;

}
```

## 🔒 Security

- File uploads are restricted to PDFs only
- Multer middleware for secure file handling
- Size limits on uploads

## ⚠️ Error Handling

The server includes centralized error handling middleware that catches and processes:

- File upload errors
- PDF processing errors
- Database errors
- Invalid request errors
- Validation errors

## 🛠 Development

### Adding New Features

1. Create necessary route in `routes/`
2. Implement controller logic in `controllers/`
3. Add any required middleware in `middlewares/`
4. Update models if needed in `models/`

### Code Style

- Use async/await for asynchronous operations
- Implement error handling middleware for all async operations
- Follow the existing project structure
- Use meaningful variable and function names

### 📦 Package Analysis

### Current Dependencies Analysis

### Required Packages (Keep)

```json
{
  "@types/express": "^5.0.1", // Type definitions for Express.js
  "@types/mongoose": "^5.11.96", // Type definitions for Mongoose (MongoDB ODM)
  "@types/node": "^22.15.3", // Type definitions for Node.js
  "bcrypt": "^5.1.1", // Password hashing library
  "cloudinary": "^2.6.0", // Cloud storage for image/file uploads
  "cookie-parser": "^1.4.7", // Middleware for parsing cookies in Express.js
  "cors": "^2.8.5", // Middleware for handling Cross-Origin Resource Sharing (CORS)
  "dotenv": "^16.5.0", // Loads environment variables from a .env file
  "express": "^5.1.0", // Web framework for building APIs
  "express-validator": "^7.2.1", // Middleware for validating and sanitizing user inputs
  "jsonwebtoken": "^9.0.2", // Library for handling JSON Web Tokens (JWT)
  "mongoose": "^8.14.0", // MongoDB object modeling for Node.js
  "multer": "^1.4.5-lts.2", // Middleware for handling file uploads
  "pdf-lib": "^1.17.1", // Library for manipulating PDF files (e.g., merge, split, extract pages)
  "ts-node": "^10.9.2", // TypeScript execution engine
  "typescript": "^5.8.3" // TypeScript compiler
}
```

### Development Dependencies (Keep)

```json
{
  "@types/bcrypt": "^5.0.2", // Type definitions for bcrypt
  "@types/cookie-parser": "^1.4.8", // Type definitions for cookie-parser
  "@types/cors": "^2.8.17", // Type definitions for cors
  "@types/jsonwebtoken": "^9.0.9", // Type definitions for jsonwebtoken
  "@types/multer": "^1.4.12", // Type definitions for multer
  "nodemon": "^3.1.10" // Development tool for automatic server restart on code changes
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## 🆘 Support

For support, please create an issue in the repository or contact the maintainers.
