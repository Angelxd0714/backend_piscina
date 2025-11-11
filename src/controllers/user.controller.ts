import { Response } from "express";
import { User, UserStatus } from "../models/User";
import { AuthRequest } from "../middlewares/auth.middleware";
import { successResponse, errorResponse } from "../utils/responses";
import { validationResult } from "express-validator";

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    successResponse(res, users);
  } catch (error: any) {
    errorResponse(res, error.message);
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      errorResponse(res, "Usuario no encontrado", 404);
      return;
    }

    successResponse(res, user);
  } catch (error: any) {
    errorResponse(res, error.message);
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorResponse(res, "Errores de validación", 400, errors.array());
      return;
    }

    const { password, cedula, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      errorResponse(res, "Usuario no encontrado", 404);
      return;
    }

    successResponse(res, user, "Usuario actualizado exitosamente");
  } catch (error: any) {
    errorResponse(res, error.message);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      errorResponse(res, "Usuario no encontrado", 404);
      return;
    }

    successResponse(res, null, "Usuario eliminado exitosamente");
  } catch (error: any) {
    errorResponse(res, error.message);
  }
};

export const toggleUserState = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      errorResponse(res, "Usuario no encontrado", 404);
      return;
    }

    user.estado =
      user.estado === UserStatus.ACTIVO
        ? UserStatus.INACTIVO
        : UserStatus.ACTIVO;
    await user.save();

    successResponse(
      res,
      { estado: user.estado },
      `Usuario ${user.estado === UserStatus.ACTIVO ? "activado" : "inactivado"} exitosamente`,
    );
  } catch (error: any) {
    errorResponse(res, error.message);
  }
};
