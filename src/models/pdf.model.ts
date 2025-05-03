import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface IPDF extends Document {
  _id: ObjectId;
  userId: ObjectId;
  fileName: string;
  publicId: string;
  pdfUrl: string;
}

const pdfSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const pdfModel = mongoose.model<IPDF>("PDF", pdfSchema);

export default pdfModel;
