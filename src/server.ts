import express from "express";
import { auth } from "./routes/auth";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware";
import { pdf } from "./routes/pdf";

dotenv.config();

const app = express();
const allowedOrigins = process.env.CLIENT_ORIGINS;

/*  
   Set up CORS to allow requests from specific origins, with support for credentials (cookies)
   - origin: Specifies which client origins are allowed to make requests.
   - methods: Restrict allowed HTTP methods (only GET and POST are allowed here).
   - credentials: Allows the server to accept cookies sent by the client.
*/
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes for authentication.
app.use("/api/v1/auth", auth);

// Routes for handling PDF.
app.use("/api/v1/pdf", pdf);

// Error-handling middleware.
app.use(errorMiddleware);

export default app;
