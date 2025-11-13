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
            .map((p: string) => parseFloat(p.trim()));
        }
      }
      if (Array.isArray(req.body.profundidades)) {
        req.body.profundidades = req.body.profundidades.map((p: any) =>
          typeof p === "string" ? parseFloat(p) : p,
        );
      }
    }
    if (req.body.bombas) {
      if (typeof req.body.bombas === "string") {
        req.body.bombas = JSON.parse(req.body.bombas);
      } else {
        req.body.bombas = req.body.bombas || [];
      }
    }
    if (req.body.totalProfundidades) {
      if (typeof req.body.totalProfundidades === "string") {
        req.body.totalProfundidades = parseInt(req.body.totalProfundidades, 10);
      }
    }
    const numericFields = ["altura", "ancho", "temperaturaExterna"];
    numericFields.forEach((field) => {
      if (req.body[field] && typeof req.body[field] === "string") {
        req.body[field] = parseFloat(req.body[field]);
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
