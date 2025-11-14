import { Request, Response, NextFunction } from "express";

/**
 * Intenta parsear JSON de forma segura
 * Retorna el valor parseado o el original si falla
 */
const safeJSONParse = (value: any): any => {
  // Si ya es un objeto, devolverlo tal cual
  if (typeof value === "object" && value !== null) {
    return Array.isArray(value) ? value : value;
  }

  // Si no es string, retornar como está
  if (typeof value !== "string") {
    return value;
  }

  // Si es string vacío
  if (value.trim() === "") {
    return null;
  }

  // Intentar parsear JSON
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(`⚠️ No se pudo parsear JSON: ${value.substring(0, 50)}...`);
    return null;
  }
};

export const parseFormData = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // ✅ Parsear profundidades
    if (req.body.profundidades) {
      if (typeof req.body.profundidades === "string") {
        try {
          req.body.profundidades = JSON.parse(req.body.profundidades);
        } catch (e) {
          // Fallback: dividir por comas si es CSV
          req.body.profundidades = req.body.profundidades
            .split(",")
            .map((p: string) => parseFloat(p.trim()))
            .filter((p: number) => !isNaN(p));
        }
      }

      // Asegurar que es array de números
      if (Array.isArray(req.body.profundidades)) {
        req.body.profundidades = req.body.profundidades
          .map((p: any) => {
            const parsed = typeof p === "string" ? parseFloat(p) : p;
            return isNaN(parsed) ? null : parsed;
          })
          .filter((p: number | null) => p !== null);
      }
    }

    // ✅ Parsear bombas (más robusto)
    if (req.body.bombas) {
      if (typeof req.body.bombas === "string") {
        try {
          const parsed = JSON.parse(req.body.bombas);
          req.body.bombas = Array.isArray(parsed) ? parsed : [parsed];
        } catch (error) {
          console.error("❌ Error al parsear bombas:", error);
          req.body.bombas = [];
        }
      } else if (Array.isArray(req.body.bombas)) {
        req.body.bombas = req.body.bombas;
      } else {
        req.body.bombas = [];
      }
    } else {
      req.body.bombas = [];
    }

    // ✅ Parsear totalProfundidades
    if (req.body.totalProfundidades) {
      if (typeof req.body.totalProfundidades === "string") {
        const parsed = parseInt(req.body.totalProfundidades, 10);
        req.body.totalProfundidades = isNaN(parsed) ? 0 : parsed;
      }
    }

    // ✅ Campos numéricos
    const numericFields = ["altura", "ancho", "temperaturaExterna"];
    numericFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        if (typeof req.body[field] === "string") {
          const parsed = parseFloat(req.body[field]);
          req.body[field] = isNaN(parsed) ? null : parsed;
        }
      }
    });

    console.log("✅ parseFormData completado:", {
      profundidades: req.body.profundidades,
      bombasCount: req.body.bombas?.length || 0,
    });

    next();
  } catch (error) {
    console.error("❌ Error en parseFormData:", error);
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al parsear los datos del formulario",
    });
  }
};
