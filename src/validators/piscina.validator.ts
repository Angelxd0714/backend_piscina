import { body } from "express-validator";
import { Categoria, Forma, Tipo } from "../models/Piscina";

export const createPiscinaValidator = [
  body("nombre").trim().notEmpty().withMessage("El nombre es requerido"),

  body("direccion").trim().notEmpty().withMessage("La dirección es requerida"),

  body("altura")
    .isFloat({ min: 0.1 })
    .withMessage("La altura debe ser mayor a 0"),

  body("ancho")
    .isFloat({ min: 0.1 })
    .withMessage("El ancho debe ser mayor a 0"),

  body("ciudad").trim().notEmpty().withMessage("La ciudad es requerida"),

  body("municipio").trim().notEmpty().withMessage("El municipio es requerido"),

  body("temperaturaExterna")
    .optional()
    .isFloat()
    .withMessage("La temperatura debe ser un número"),

  body("categoria")
    .isIn(Object.values(Categoria))
    .withMessage("Categoría inválida"),

  body("totalProfundidades")
    .isInt({ min: 1 })
    .withMessage("Debe haber al menos 1 profundidad"),

  body("profundidades")
    .isArray({ min: 1 })
    .withMessage("Debe proporcionar al menos 1 profundidad")
    .custom((value, { req }) => {
      if (value.length !== req.body.totalProfundidades) {
        throw new Error(
          "La cantidad de profundidades no coincide con el total",
        );
      }

      for (let i = 1; i < value.length; i++) {
        if (value[i] <= value[i - 1]) {
          throw new Error("Las profundidades deben estar en orden ascendente");
        }
      }

      return true;
    }),

  body("forma").isIn(Object.values(Forma)).withMessage("Forma inválida"),

  body("uso").isIn(Object.values(Tipo)).withMessage("Uso inválido"),

  body("filtros").trim().notEmpty().withMessage("Los filtros son requeridos"),

  body("bombas")
    .isArray({ min: 1 })
    .withMessage("Debe agregar al menos 1 bomba"),
];
