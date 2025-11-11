import { Request, Response, NextFunction } from "express";
import { IUser, User } from "../models/User";
import { errorResponse, successResponse } from "../utils/responses";
import jwt from "jsonwebtoken";
export interface AuthRequest extends Request {
  user?: IUser;
}
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return errorResponse(res, "Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await User.findById(decoded.id).select("+password");
    if (!user) {
      return errorResponse(res, "User not found");
    }
    req.user = user;
    next();
    if (user.estado === "inactivo") {
      return errorResponse(res, "Forbidden");
    }
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, "Unauthorized");
  }
};
