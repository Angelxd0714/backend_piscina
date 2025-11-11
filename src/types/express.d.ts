import { IUser } from "../models/User";
import { FileArray, UploadedFile } from "express-fileupload";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      files?: FileArray | null;
    }
  }
}

export {};
