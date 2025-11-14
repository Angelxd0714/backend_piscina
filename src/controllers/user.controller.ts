import { Request, Response } from "express";
import { UserStatus } from "../models/dto/User.enum";
import { User } from "../models/User";
import { successResponse, errorResponse } from "../utils/responses";
import { validationResult } from "express-validator";

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    successResponse(res, users);
    return;
  } catch (error: any) {
    errorResponse(res, error.message);
    return;
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      errorResponse(res, "Usuario no encontrado", 404);
      return;
    }

    successResponse(res, user);
    return;
  } catch (error: any) {
    errorResponse(res, error.message);
    return;
  }
};

export const updateUser = async (
  req: Request,
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
    return;
  } catch (error: any) {
    errorResponse(res, error.message);
    return;
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      errorResponse(res, "Usuario no encontrado", 404);
      return;
    }

    successResponse(res, null, "Usuario eliminado exitosamente");
    return;
  } catch (error: any) {
    errorResponse(res, error.message);
    return;
  }
};

export const toggleUserState = async (
  req: Request,
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
    return;
  } catch (error: any) {
    errorResponse(res, error.message);
    return;
  }
};
