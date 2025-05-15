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
    Purpose: Upload a PDF file to Cloudinary and store its metadata in the database
    Incoming: { file,fileName } (PDF file,PDF fileName in the request body)
    Returns: { pdfData } (metadata of the uploaded PDF)
*/
export const addPdf = async (req: Request, res: Response): Promise<void> => {
  if (!req?.file) {
    throw new AppError(PdfMessages.NO_FILE_TO_UPLOAD, StatusCodes.BAD_REQUEST);
  }
  if (!req?.body.fileName || typeof req.body.fileName !== "string") {
    throw new AppError(
      PdfMessages.PDF_FILE_NAME_IS_REQUIRED,
      StatusCodes.BAD_REQUEST
    );
  }

  const existingName = await pdfModel.findOne({
    fileName: req.body.fileName,
    userId: req?.user?.userId,
  });

  if (existingName) {
    throw new AppError(
      PdfMessages.NAME_ALREADY_EXISTS,
      StatusCodes.BAD_REQUEST
    );
  }
  const { url, publicId } = await uploadPdf({
    pdf: req?.file?.buffer,
    folder: process.env.CLOUDINARY_PDF_UPLOADING_FOLDER as string,
  });

  if (!url || !publicId) {
    throw new AppError(
      CloudinaryMessage.FAILED_TO_UPLOAD,
      StatusCodes.BAD_REQUEST
    );
  }

  const pdfData = await pdfModel.create({
    fileName: req.body.fileName,
    pdfUrl: url,
    publicId: publicId,
    userId: req?.user?.userId,
  });
  sendResponse(
    res,
    StatusCodes.OK,
    { pdfData },
    CloudinaryMessage.PDF_UPLOAD_SUCCESS
  );
};

/*  
    Route: POST api/v1/pdf/retrieve-pdfs
    Purpose: Retrieve the list of PDFs uploaded by the current user
     Incoming: Query parameters `page` and `limit` (optional) for pagination `searchQuery` for search functionality.
              User ID is extracted from user context.
    Returns: A JSON object containing:
      -  pdfs       : List of PDF metadata.
      -  totalPages : Total number of pages for pagination.
      -  currentPage: The current page number.
*/

export const getPdfs = async (req: Request, res: Response): Promise<void> => {
  const userId = req?.user?.userId;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const skip = (page - 1) * limit;
  const searchQuery = (req.query.searchQuery as string) || "";

  const searchFilter = searchQuery
    ? {
        fileName: { $regex: `^${searchQuery}`, $options: "i" },
      }
    : {};

  const pdfs = await pdfModel
    .find({ userId: new mongoose.Types.ObjectId(userId), ...searchFilter })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (!pdfs) {
    throw new AppError(
      PdfMessages.FAILED_TO_RETRIEVE_PDF_LIST,
      StatusCodes.BAD_REQUEST
    );
  }
  const totalPdfs = await pdfModel.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    ...searchFilter,
  });
  const totalPages = Math.ceil(totalPdfs / limit);
  sendResponse(
    res,
    StatusCodes.OK,
    { pdfs: pdfs, totalPages: totalPages, currentPage: page },
    PdfMessages.PDF_DATA_RETRIEVED_SUCCESS
  );
};

/*  
 Route: POST api/v1/pdf/extract
    Purpose: Extract specified pages from an existing PDF and create a new PDF.
    Incoming:
      - { pdfId } in the URL parameters (ID of the PDF to extract pages from).
      - { pages } in the request body (an array of page numbers to extract).
      - { fileName } in the request body (desired name for the new PDF).
       const deleteExistingPdf = in the request body(deleting existing pdf true or false value)
    Returns: 
      - { newCreatedPdf } (metadata of the newly created PDF, including URL and file information).
*/

export const extractPagesToNewPdf = async (
  req: Request,
  res: Response
): Promise<void> => {
  const pdfId = req.params.pdfId;
  const userId = req?.user?.userId;
  const pages = req.body.pages;
  const fileName = req?.body?.fileName;
  const deleteExistingPdf = req?.body?.deleteExistingPdf;

  const pdfData = await pdfModel.findById({
    _id: new mongoose.Types.ObjectId(pdfId),
  });

  if (!pdfData) {
    throw new AppError(
      PdfMessages.FAILED_TO_RETRIEVE_PDF_DATA,
      StatusCodes.BAD_REQUEST
    );
  }

  const existingPdf = await pdfModel.findOne({
    fileName: fileName,
    userId: userId,
  });

  if (existingPdf) {
    throw new AppError(
      PdfMessages.NAME_ALREADY_EXISTS,
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
    fileName: fileName,
    pdfUrl: newPdfUrl,
    publicId: newPublicId,
    userId: userId,
  });

  if (deleteExistingPdf) {
    await pdfModel.findByIdAndDelete(pdfId);
  }

  sendResponse(
    res,
    StatusCodes.OK,
    { newCreatedPdf },
    CloudinaryMessage.PDF_EXTRACT_SUCCESS
  );
};
