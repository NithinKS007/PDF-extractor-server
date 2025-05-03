import mongoose from "mongoose";

/* 
  Function to connect to the MongoDB database.
  It attempts to connect using the URI from environment variables.
  If the connection fails, or if the URI is not provided, the process exits with a failure status code.
*/
const connectDB = async (): Promise<void> => {
  const uri: string = process.env.ATLAS_DATABASE_CONFIG!;
  if (!uri) {
    console.error("Database URI is not defined in environment variables");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
