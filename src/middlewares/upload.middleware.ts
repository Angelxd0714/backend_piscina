import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import { errorResponse } from "../utils/responses";

export const validatePiscinaFiles = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    if (!req.files) {
      errorResponse(res, "Archivos requeridos no proporcionados", 400);
      return;
    }

    const files = req.files;

    const foto = files.foto as UploadedFile | undefined;
    if (!foto) {
      errorResponse(res, "La foto de la piscina es requerida", 400);
      return;
    }

    const validImageFormats = ["image/png", "image/jpeg"];
    if (!validImageFormats.includes(foto.mimetype)) {
      errorResponse(res, "La foto debe ser PNG o JPEG", 400);
      return;
    }

    const bombasData = JSON.parse(req.body.bombas || "[]");

    for (let i = 0; i < bombasData.length; i++) {
      const fotoBomba = files[`fotoBomba_${i}`] as UploadedFile | undefined;
      const hojaSeguridad = files[`hojaSeguridad_${i}`] as
        | UploadedFile
        | undefined;
      const fichaTecnica = files[`fichaTecnica_${i}`] as
        | UploadedFile
        | undefined;

      if (!fotoBomba) {
        errorResponse(res, `Foto de la bomba ${i + 1} es requerida`, 400);
        return;
      }
      if (!hojaSeguridad) {
        errorResponse(
          res,
          `Hoja de seguridad de la bomba ${i + 1} es requerida`,
          400,
        );
        return;
      }
      if (!fichaTecnica) {
        errorResponse(
          res,
          `Ficha técnica de la bomba ${i + 1} es requerida`,
          400,
        );
        return;
      }
      if (!validImageFormats.includes(fotoBomba.mimetype)) {
        errorResponse(
          res,
          `La foto de la bomba ${i + 1} debe ser PNG o JPEG`,
          400,
        );
        return;
      }
      if (hojaSeguridad.mimetype !== "application/pdf") {
        errorResponse(
          res,
          `La hoja de seguridad de la bomba ${i + 1} debe ser PDF`,
          400,
        );
        return;
      }
      if (fichaTecnica.mimetype !== "application/pdf") {
        errorResponse(
          res,
          `La ficha técnica de la bomba ${i + 1} debe ser PDF`,
          400,
        );
        return;
      }
    }

    next();
  } catch (error: any) {
    errorResponse(res, error.message, 400);
  }
};

export const validateUpdatePiscinaFiles = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    if (!req.files) {
      next();
      return;
    }

    const files = req.files;
    const validImageFormats = ["image/png", "image/jpeg"];

    const foto = files.foto as UploadedFile | undefined;
    if (foto && !validImageFormats.includes(foto.mimetype)) {
      errorResponse(res, "La foto debe ser PNG o JPEG", 400);
      return;
    }
    if (req.body.bombas) {
      const bombasData = JSON.parse(req.body.bombas);

      for (let i = 0; i < bombasData.length; i++) {
        const fotoBomba = files[`fotoBomba_${i}`] as UploadedFile | undefined;
        const hojaSeguridad = files[`hojaSeguridad_${i}`] as
          | UploadedFile
          | undefined;
        const fichaTecnica = files[`fichaTecnica_${i}`] as
          | UploadedFile
          | undefined;

        if (fotoBomba && !validImageFormats.includes(fotoBomba.mimetype)) {
          errorResponse(
            res,
            `La foto de la bomba ${i + 1} debe ser PNG o JPEG`,
            400,
          );
          return;
        }
        if (hojaSeguridad && hojaSeguridad.mimetype !== "application/pdf") {
          errorResponse(
            res,
            `La hoja de seguridad de la bomba ${i + 1} debe ser PDF`,
            400,
          );
          return;
        }
        if (fichaTecnica && fichaTecnica.mimetype !== "application/pdf") {
          errorResponse(
            res,
            `La ficha técnica de la bomba ${i + 1} debe ser PDF`,
            400,
          );
          return;
        }
      }
    }

    next();
  } catch (error: any) {
    errorResponse(res, error.message, 400);
  }
};
