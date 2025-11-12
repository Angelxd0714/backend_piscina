import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "No autorizado, token no proporcionado",
      });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("+password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
      return;
    }

    if (user.estado === "INACTIVO") {
      res.status(403).json({
        success: false,
        message: "Usuario inactivo, no puede acceder",
      });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
    });
    return;
  }
};
