import { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../utils/responses";
import { UserRoles } from "../models/User";

export const authorize = (...roles: UserRoles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, "Unauthorized");
    }
    if (!roles.includes(req.user.rol)) {
      return errorResponse(res, "Error registering user");
    }
    next();
  };
};
