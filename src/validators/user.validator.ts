import { body } from "express-validator";
import { UserRoles } from "../models/User";
export const registerUserValidator = [
  body("nombre").trim().notEmpty().withMessage("El nombre es requerido"),

  body("apellido").optional().trim(),

  body("identificacion")
    .trim()
    .notEmpty()
    .withMessage("La cédula es requerida")
    .isLength({ min: 6, max: 15 })
    .withMessage("La cédula debe tener entre 6 y 15 caracteres"),

  body("correo")
    .trim()
    .notEmpty()
    .withMessage("El correo es requerido")
    .isEmail()
    .withMessage("Correo inválido")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),

  body("rol")
    .optional()
    .isIn(Object.values(UserRoles))
    .withMessage("Rol inválido"),
];
export const loginValidator = [
  body("correo")
    .trim()
    .notEmpty()
    .withMessage("El correo es requerido")
    .isEmail()
    .withMessage("Correo inválido")
    .normalizeEmail(),

  body("password").trim().notEmpty().withMessage("La contraseña es requerida"),
];

export const updateUserValidator = [
  body("nombre")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),

  body("apellido").optional().trim(),

  body("correo")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Correo inválido")
    .normalizeEmail(),

  body("estado")
    .optional()
    .isIn(["ACTIVO", "INACTIVO"])
    .withMessage("Estado inválido"),

  body("rol")
    .optional()
    .isIn(Object.values(UserRoles))
    .withMessage("Rol inválido"),
];
