import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { successResponse, errorResponse } from "../utils/responses";
import { validationResult } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 3600;
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorResponse(res, "Error validating user data", 400, errors.array());
      return;
    }

    const { nombre, apellido, identificacion, correo, password, rol } =
      req.body;

    const existingUser = await User.findOne({
      $or: [{ correo }, { identificacion }],
    });

    if (existingUser) {
      errorResponse(res, "User already exists", 409);
      return;
    }

    const newUser = new User({
      nombre,
      apellido,
      identificacion,
      correo,
      password,
      rol: rol || "user",
    });

    await newUser.save();

    if (!JWT_SECRET) {
      errorResponse(res, "JWT_SECRET is not defined", 500);
      return;
    }

    const token = jwt.sign({ id: String(newUser._id) }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    successResponse(
      res,
      {
        token,
        user: {
          id: newUser._id,
          nombre: newUser.nombre,
          apellido: newUser.apellido,
          email: newUser.correo,
          rol: newUser.rol,
          state: newUser.estado,
        },
      },
      "Usuario registrado exitosamente",
      201,
    );
  } catch (error) {
    console.error(error);
    errorResponse(res, "Error registering user");
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo, password } = req.body;

    const user = await User.findOne({ correo });

    if (!user || !(await user.comparePassword(password))) {
      errorResponse(res, "Invalid credentials", 401);
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 3600;

    if (!JWT_SECRET) {
      errorResponse(res, "JWT_SECRET is not defined", 500);
      return;
    }

    const token = jwt.sign({ id: String(user._id) }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.correo,
          rol: user.rol,
          state: user.estado,
        },
      },
      "Usuario logueado exitosamente",
      200,
    );
  } catch (error) {
    console.error(error);
    errorResponse(res, "Error logging in user");
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      errorResponse(res, "Token is required", 400);
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET || "");

    if (!decoded) {
      errorResponse(res, "Invalid token", 401);
      return;
    }

    successResponse(res, {}, "Usuario deslogueado exitosamente", 200);
  } catch (error) {
    console.error(error);
    errorResponse(res, "Error logging out user");
  }
};
