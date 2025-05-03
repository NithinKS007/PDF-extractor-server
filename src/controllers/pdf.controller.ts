import { Request, Response } from "express";
import pdfModel from "../models/pdf.model";
import { AppError } from "../utils/app.error";
import uploadPdf, { downloadPdfFromCloudinary } from "../utils/cloudinary";
import { StatusCodes } from "../utils/http.status.codes";
import { CloudinaryMessage, PdfMessages } from "../utils/http.status.messages";
import { sendResponse } from "../utils/send.response";
import mongoose from "mongoose";
import { PDFDocument } from "pdf-lib";

/*  
    Route: POST api/v1/pdf/upload
    Purpose: user uploading pdf
*/
export const addPdf = async (req: Request, res: Response) => {
  if (!req?.file) {
    throw new AppError(
      CloudinaryMessage.NoFileToUpload,
      StatusCodes.BAD_REQUEST
    );
  }

  const { url, publicId } = await uploadPdf({
    pdf: req?.file?.buffer,
    folder: process.env.CLOUDINARY_PDF_UPLOADING_FOLDER as string,
  });

  if (!url || !publicId) {
    throw new AppError(
      CloudinaryMessage.FailedToUpload,
      StatusCodes.BAD_REQUEST
    );
  }

  const pdfData = await pdfModel.create({
    fileName: `PDF-Extractor-${Date.now()}-${req.file.originalname}`,
    pdfUrl: url,
    publicId: publicId,
    userId: req?.user?.userId,
  });
  sendResponse(
    res,
    StatusCodes.OK,
    { pdfData },
    CloudinaryMessage.PdfUploadSuccess
  );
};

/*  
    Route: POST api/v1/pdf/retrieve-pdfs
    Purpose: user retrieving pdfs
*/

export const getPdfs = async (req: Request, res: Response) => {
  const userId = req?.user?.userId;
  const pdfs = await pdfModel
    .find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ createdAt: -1 });

  if (!pdfs) {
    throw new AppError(
      PdfMessages.FailedToRetrievePdfList,
      StatusCodes.BAD_REQUEST
    );
  }

  sendResponse(
    res,
    StatusCodes.OK,
    { pdfs: pdfs },
    CloudinaryMessage.PdfUploadSuccess
  );
};

/*  
    Route: POST api/v1/pdf/extract
    Purpose: user extract pages and create new pdf
*/

export const extractPagesToNewPdf = async (req: Request, res: Response) => {
  const pdfId = req.params.pdfId;
  const userId = req?.user?.userId;
  const pages = req.body.pages;

  const pdfData = await pdfModel.findById({
    _id: new mongoose.Types.ObjectId(pdfId),
  });

  if (!pdfData) {
    throw new AppError(
      PdfMessages.FailedToRetrievePdfData,
      StatusCodes.BAD_REQUEST
    );
  }
  const { pdfUrl } = pdfData;
  const pdfBuffer = await downloadPdfFromCloudinary(pdfUrl);
  const originalPdf = await PDFDocument.load(pdfBuffer);
  const newPdf = await PDFDocument.create();
  for (const pageNum of pages) {
    const [copiedPage] = await newPdf.copyPages(originalPdf, [pageNum - 1]);
    newPdf.addPage(copiedPage);
  }

  const pdfBytes = await newPdf.save();
  const pdfStream = Buffer.from(pdfBytes);
  const { url: newPdfUrl, publicId: newPublicId } = await uploadPdf({
    pdf: pdfStream,
    folder: process.env.CLOUDINARY_PDF_UPLOADING_FOLDER as string,
  });

  const newCreatedPdf = await pdfModel.create({
    fileName: `PDF-Extractor-${Date.now()}-${pdfData.fileName}`,
    pdfUrl: newPdfUrl,
    publicId: newPublicId,
    userId: userId,
  });

  sendResponse(
    res,
    StatusCodes.OK,
    { newCreatedPdf },
    CloudinaryMessage.PdfExtractSuccess
  );
};
