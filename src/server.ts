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
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use("/api/v1/auth", auth);
app.use("/api/v1/pdf",pdf)
app.use(errorMiddleware);

export default app;
