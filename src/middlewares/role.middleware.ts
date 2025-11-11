import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { RESPONSES } from "../utils/responses";
import { UserRoles } from "../models/User";

export const authorize = (...roles: UserRoles[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json(RESPONSES.UNAUTHORIZED);
    }
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json(RESPONSES.FORBIDDEN);
    }
    next();
  };
};
