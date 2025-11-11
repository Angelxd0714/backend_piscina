import { Request, Response, NextFunction } from "express";
import { IUser, User } from "../models/User";
import { RESPONSES } from "../utils/responses";
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
    return res.status(401).json(RESPONSES.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await User.findById(decoded.id).select("+password");
    if (!user) {
      res.status(404).json(RESPONSES.NOT_FOUND);
      return;
    }
    req.user = user;
    next();
    if (user.estado === "inactive") {
      res.status(403).json(RESPONSES.FORBIDDEN);
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(RESPONSES.UNAUTHORIZED);
  }
};
