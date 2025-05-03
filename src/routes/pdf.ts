import express from "express";
import { authenticate } from "../middlewares/authentication.middleware";
import upload from "../utils/multer";
import { addPdf, getPdfs ,extractPagesToNewPdf} from "../controllers/pdf.controller";

export const pdf = express.Router();

pdf.post("/upload",authenticate,upload.single("file"),addPdf)
pdf.get("/retrieve",authenticate,getPdfs)
pdf.post("/extract/:pdfId",authenticate,extractPagesToNewPdf)