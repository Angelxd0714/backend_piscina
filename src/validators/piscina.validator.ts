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
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error("Profundidades debe ser un array");
      }
      if (value.length === 0) {
        throw new Error("Debe proporcionar al menos 1 profundidad");
      }
      return true;
    })
    .custom((value, { req }) => {
      if (value.length !== req.body.totalProfundidades) {
        throw new Error(
          "La cantidad de profundidades no coincide con el total",
        );
      }
      return true;
    })
    .custom((value) => {
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
    .custom((value) => {
      console.log(value);
      if (!Array.isArray(value)) {
        throw new Error("Bombas debe ser un array");
      }
      if (value.length === 0) {
        throw new Error("Debe agregar al menos 1 bomba");
      }
      return true;
    })
    .custom((value) => {
      value.forEach((bomba: any, index: number) => {
        if (!bomba.marca) {
          throw new Error(`La marca de la bomba ${index} es requerida`);
        }
        if (!bomba.referencia) {
          throw new Error(`La referencia de la bomba ${index} es requerida`);
        }
        if (!bomba.potencia) {
          throw new Error(`La potencia de la bomba ${index} es requerida`);
        }
        if (!bomba.material) {
          throw new Error(`El material de la bomba ${index} es requerido`);
        }
        if (!["Sumergible", "Centrifuga"].includes(bomba.material)) {
          throw new Error(
            `El material de la bomba ${index} debe ser "Sumergible" o "Centrifuga"`,
          );
        }
        if (bomba.seRepite === "si" && !bomba.totalBombas) {
          throw new Error(
            `La bomba ${index} requiere el campo totalBombas cuando seRepite es "si"`,
          );
        }
      });
      return true;
    }),
];
