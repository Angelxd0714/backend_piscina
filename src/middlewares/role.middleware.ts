// src/middlewares/role.middleware.ts
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responses";
import { UserRoles } from "../models/User";

export const authorize = (...roles: UserRoles[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = (req as any).user;

      if (!user) {
        errorResponse(res, "Usuario no autenticado", 401);
        return;
      }

      if (!roles.includes(user.rol)) {
        errorResponse(
          res,
          `El rol ${user.rol} no tiene permiso para esta acción`,
          403,
        );
        return;
      }
      next();
    } catch (error) {
      console.error("Error en authorize:", error);
      errorResponse(res, "Error de autorización", 500);
    }
  };
};
