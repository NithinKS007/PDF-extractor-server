import dotenv from "dotenv";
import app from "./server";
import connectDB from "./config/db.config";
import { JwtPayload } from "jsonwebtoken";

/*  
    Global Declaration: Adding `user` property to the Express Request object for type safety.
    Purpose: This allows the `Request` object to optionally contain a `user` property of type `JwtPayload`, 
    which can be used in the application to store user data decoded from a JWT token.
    This declaration is global so it will be available throughout the project.
*/
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
