import { Request, Response, NextFunction } from "express";

export const parseFormData = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    if (req.body.profundidades) {
      if (typeof req.body.profundidades === "string") {
        try {
          req.body.profundidades = JSON.parse(req.body.profundidades);
        } catch (e) {
          req.body.profundidades = req.body.profundidades
            .split(",")
            .map((p: string) => parseFloat(p.trim()))
            .filter((p: number) => !isNaN(p));
        }
      }
      if (Array.isArray(req.body.profundidades)) {
        req.body.profundidades = req.body.profundidades
          .map((p: any) => {
            const parsed = typeof p === "string" ? parseFloat(p) : p;
            return isNaN(parsed) ? null : parsed;
          })
          .filter((p: number | null) => p !== null);
      }
    }

    if (req.body.bombas) {
      if (typeof req.body.bombas === "string") {
        try {
          const parsed = JSON.parse(req.body.bombas);
          req.body.bombas = Array.isArray(parsed) ? parsed : [parsed];
        } catch (error) {
          console.error("Error parseando bombas:", error);
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

    if (req.body.totalProfundidades) {
      if (typeof req.body.totalProfundidades === "string") {
        const parsed = parseInt(req.body.totalProfundidades, 10);
        req.body.totalProfundidades = isNaN(parsed) ? 0 : parsed;
      }
    }

    const numericFields = ["altura", "ancho", "temperaturaExterna"];
    numericFields.forEach((field) => {
      if (req.body[field] && typeof req.body[field] === "string") {
        const parsed = parseFloat(req.body[field]);
        req.body[field] = isNaN(parsed) ? null : parsed;
      }
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
