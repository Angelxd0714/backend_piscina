import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { successResponse, errorResponse } from "../utils/responses";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_por_defecto";
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 3600;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorResponse(
        res,
        "Error validando datos del usuario",
        400,
        errors.array(),
      );
      return;
    }

    const { nombre, apellido, identificacion, correo, password, rol } =
      req.body;

    const existingUser = await User.findOne({
      $or: [{ correo }, { identificacion }],
    });

    if (existingUser) {
      errorResponse(res, "El usuario ya existe", 409);
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
          estado: newUser.estado,
        },
      },
      "Usuario registrado exitosamente",
      201,
    );
  } catch (error: any) {
    console.error("❌ Error en register:", error);
    errorResponse(res, "Error registrando usuario");
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo, password } = req.body;

    const user = await User.findOne({ correo });

    if (!user || !(await user.comparePassword(password))) {
      errorResponse(res, "Credenciales inválidas", 401);
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
          estado: user.estado,
        },
      },
      "Usuario logueado exitosamente",
      200,
    );
  } catch (error: any) {
    console.error("❌ Error en login:", error);
    errorResponse(res, "Error al hacer login");
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      errorResponse(res, "Token requerido", 400);
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      errorResponse(res, "Token inválido", 401);
      return;
    }

    successResponse(res, {}, "Usuario deslogueado exitosamente", 200);
  } catch (error: any) {
    console.error("❌ Error en logout:", error);
    errorResponse(res, "Error al hacer logout");
  }
};

export const requestPasswordReset = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { correo } = req.body;

    if (!correo) {
      errorResponse(res, "El correo es requerido", 400);
      return;
    }

    const user = await User.findOne({ correo });

    if (!user) {
      errorResponse(res, "Usuario no encontrado", 404);
      return;
    }

    const resetToken = jwt.sign({ userId: user._id, correo }, JWT_SECRET, {
      expiresIn: "20m",
    });

    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 20 * 60 * 1000);
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: correo,
      subject: "Recuperar contraseña",
      html: `
        <h2>Recuperar contraseña</h2>
        <p>Haz clic en el siguiente link para resetear tu contraseña:</p>
        <a href="${resetLink}">Resetear contraseña</a>
        <p>Este link expira en 20 minutos.</p>
      `,
    });

    successResponse(res, {}, "Email de recuperación enviado", 200);
  } catch (error: any) {
    console.error("❌ Error en requestPasswordReset:", error);
    errorResponse(res, error.message);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      errorResponse(res, "Token y contraseña son requeridos", 400);
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user || user.resetToken !== token) {
      errorResponse(res, "Token inválido o expirado", 400);
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    successResponse(res, {}, "Contraseña actualizada exitosamente", 200);
  } catch (error: any) {
    console.error("❌ Error en resetPassword:", error);
    errorResponse(res, error.message);
  }
};
