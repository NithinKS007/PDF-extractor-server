import dotenv from "dotenv";
import app from "./server";
import connectDB from "./config/db.config";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const PORT = process.env.PORT;

dotenv.config();
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
