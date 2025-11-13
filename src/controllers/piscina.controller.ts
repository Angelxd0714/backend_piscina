import { Request, Response } from "express";
import Piscina from "../models/Piscina";
import { IBomba } from "../models/Piscina";
import { successResponse, errorResponse } from "../utils/responses";
import { validationResult } from "express-validator";
import { uploadFile } from "../utils/fileUpload";
import { UploadedFile } from "express-fileupload";

export const createPiscina = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errorResponse(res, "Errores de validación", 400, errors.array());
      return;
    }

    // ✅ Parsear profundidades si viene como string
    if (typeof req.body.profundidades === "string") {
      req.body.profundidades = JSON.parse(req.body.profundidades);
    }

    // ✅ Parsear bombas si viene como string
    let bombas = [];
    if (typeof req.body.bombas === "string") {
      bombas = JSON.parse(req.body.bombas);
    } else {
      bombas = req.body.bombas || [];
    }

    if (!req.files) {
      errorResponse(res, "Archivos requeridos", 400);
      return;
    }

    const files = req.files;

    // Subir foto principal
    const fotoPiscina = files.foto as UploadedFile;
    const fotoResult = await uploadFile(fotoPiscina, "piscinas/fotos");

    // Procesar bombas con archivos
    const bombasConArchivos: IBomba[] = [];

    for (let i = 0; i < bombas.length; i++) {
      const bomba = bombas[i];

      const fotoBomba = files[`fotoBomba_${i}`] as UploadedFile;
      const hojaSeguridad = files[`hojaSeguridad_${i}`] as UploadedFile;
      const fichaTecnica = files[`fichaTecnica_${i}`] as UploadedFile;

      if (!fotoBomba || !hojaSeguridad || !fichaTecnica) {
        errorResponse(res, `Archivos faltantes para la bomba ${i}`, 400);
        return;
      }

      const fotoBombaResult = await uploadFile(
        fotoBomba,
        "piscinas/bombas/fotos",
      );
      const hojaResult = await uploadFile(
        hojaSeguridad,
        "piscinas/bombas/hojas",
      );
      const fichaResult = await uploadFile(
        fichaTecnica,
        "piscinas/bombas/fichas",
      );

      bombasConArchivos.push({
        ...bomba,
        fotoBomba: fotoBombaResult.url,
        hojaSeguridad: hojaResult.url,
        fichaTecnica: fichaResult.url,
      });
    }

    // ✅ Construir el objeto piscinaData de forma explícita
    const piscinaData = {
      nombre: req.body.nombre,
      direccion: req.body.direccion,
      altura: req.body.altura,
      ancho: req.body.ancho,
      ciudad: req.body.ciudad,
      municipio: req.body.municipio,
      temperaturaExterna: req.body.temperaturaExterna,
      categoria: req.body.categoria,
      totalProfundidades: req.body.totalProfundidades,
      profundidades: req.body.profundidades, // Ya parseado
      forma: req.body.forma,
      uso: req.body.uso,
      filtros: req.body.filtros,
      foto: fotoResult.url,
      bombas: bombasConArchivos, // Array de objetos procesado
    };

    const piscina = await Piscina.create(piscinaData);

    successResponse(res, piscina, "Piscina creada exitosamente", 201);
  } catch (error: any) {
    console.error("Error en createPiscina:", error);
    errorResponse(res, error.message);
  }
};

export const getAllPiscinas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const piscinas = await Piscina.find();
    successResponse(res, piscinas);
  } catch (error: any) {
    errorResponse(res, error.message);
  }
};

export const getPiscinaById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const piscina = await Piscina.findById(req.params.id);

    if (!piscina) {
      errorResponse(res, "Piscina no encontrada", 404);
      return;
    }

    successResponse(res, piscina);
  } catch (error: any) {
    errorResponse(res, error.message);
  }
};

export const updatePiscina = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const piscinaExistente = await Piscina.findById(req.params.id);

    if (!piscinaExistente) {
      errorResponse(res, "Piscina no encontrada", 404);
      return;
    }

    if (req.files) {
      const files = req.files;

      const foto = files.foto as UploadedFile | undefined;
      if (foto) {
        const fotoResult = await uploadFile(foto, "piscinas/fotos");
        req.body.foto = fotoResult.url;
      }

      if (req.body.bombas) {
        const bombas = JSON.parse(req.body.bombas);
        const bombasConArchivos: IBomba[] = [];

        for (let i = 0; i < bombas.length; i++) {
          const bomba = bombas[i];

          const fotoBomba = files[`fotoBomba_${i}`] as UploadedFile | undefined;
          const hojaSeguridad = files[`hojaSeguridad_${i}`] as
            | UploadedFile
            | undefined;
          const fichaTecnica = files[`fichaTecnica_${i}`] as
            | UploadedFile
            | undefined;
          const fotoBombaUrl = fotoBomba
            ? (await uploadFile(fotoBomba, "piscinas/bombas/fotos")).url
            : bomba.fotoBomba || piscinaExistente.bombas[i]?.fotoBomba;

          const hojaUrl = hojaSeguridad
            ? (await uploadFile(hojaSeguridad, "piscinas/bombas/hojas")).url
            : bomba.hojaSeguridad || piscinaExistente.bombas[i]?.hojaSeguridad;

          const fichaUrl = fichaTecnica
            ? (await uploadFile(fichaTecnica, "piscinas/bombas/fichas")).url
            : bomba.fichaTecnica || piscinaExistente.bombas[i]?.fichaTecnica;

          bombasConArchivos.push({
            ...bomba,
            fotoBomba: fotoBombaUrl,
            hojaSeguridad: hojaUrl,
            fichaTecnica: fichaUrl,
          });
        }

        req.body.bombas = bombasConArchivos;
      }
    }

    if (typeof req.body.profundidades === "string") {
      req.body.profundidades = JSON.parse(req.body.profundidades);
    }

    const piscina = await Piscina.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    successResponse(res, piscina, "Piscina actualizada exitosamente");
  } catch (error: any) {
    errorResponse(res, error.message);
  }
};

export const deletePiscina = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const piscina = await Piscina.findByIdAndDelete(req.params.id);

    if (!piscina) {
      errorResponse(res, "Piscina no encontrada", 404);
      return;
    }

    successResponse(res, null, "Piscina eliminada exitosamente");
  } catch (error: any) {
    errorResponse(res, error.message);
  }
};
