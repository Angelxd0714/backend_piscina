// src/routes/piscina.routes.ts
import { Router } from "express";
import {
  createPiscina,
  getAllPiscinas,
  getPiscinaById,
  updatePiscina,
  deletePiscina,
} from "../controllers/piscina.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { UserRoles } from "../models/dto/User.enum";
import { createPiscinaValidator } from "../validators/piscina.validator";
import {
  validatePiscinaFiles,
  validateUpdatePiscinaFiles,
} from "../middlewares/upload.middleware";
const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/piscinas:
 *   get:
 *     summary: Obtener todas las piscinas
 *     tags: [Piscinas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de piscinas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/", getAllPiscinas);

/**
 * @swagger
 * /api/piscinas/{id}:
 *   get:
 *     summary: Obtener piscina por ID
 *     tags: [Piscinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la piscina
 *     responses:
 *       200:
 *         description: Datos de la piscina
 *       404:
 *         description: Piscina no encontrada
 */
router.get("/:id", getPiscinaById);

/**
 * @swagger
 * /api/piscinas:
 *   post:
 *     summary: Crear nueva piscina (solo ADMIN)
 *     description: Crea una piscina con foto principal y múltiples bombas. Cada bomba requiere foto, hoja de seguridad (PDF) y ficha técnica (PDF).
 *     tags: [Piscinas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - direccion
 *               - altura
 *               - ancho
 *               - ciudad
 *               - municipio
 *               - categoria
 *               - totalProfundidades
 *               - profundidades
 *               - forma
 *               - uso
 *               - filtros
 *               - foto
 *               - bombas
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la piscina
 *               direccion:
 *                 type: string
 *                 description: Dirección de la piscina
 *               altura:
 *                 type: number
 *                 description: Altura de la piscina en metros
 *               ancho:
 *                 type: number
 *                 description: Ancho de la piscina en metros
 *               ciudad:
 *                 type: string
 *                 description: Ciudad donde está ubicada
 *               municipio:
 *                 type: string
 *                 description: Municipio de Colombia
 *               temperaturaExterna:
 *                 type: number
 *                 description: Temperatura externa (opcional)
 *               categoria:
 *                 type: string
 *                 enum: [Niños, Adultos]
 *                 description: Categoría de la piscina
 *               totalProfundidades:
 *                 type: integer
 *                 description: Número total de profundidades
 *               profundidades:
 *                 type: string
 *                 description: Array de profundidades en formato JSON (ej. "[1.2, 1.8, 2.5]")
 *               forma:
 *                 type: string
 *                 enum: [Rectangular, Circular]
 *                 description: Forma de la piscina
 *               uso:
 *                 type: string
 *                 enum: [Privada, Publica]
 *                 description: Uso de la piscina
 *               filtros:
 *                 type: string
 *                 description: Descripción de los filtros
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Foto principal de la piscina (PNG o JPEG, máx 5MB)
 *               bombas:
 *                 type: string
 *                 description: Array de bombas en formato JSON con marca, referencia, potencia, material, seRepite, totalBombas
 *               fotoBomba_0:
 *                 type: string
 *                 format: binary
 *                 description: Foto de la bomba 1 (PNG o JPEG, máx 5MB)
 *               hojaSeguridad_0:
 *                 type: string
 *                 format: binary
 *                 description: Hoja de seguridad de la bomba 1 (PDF, máx 5MB)
 *               fichaTecnica_0:
 *                 type: string
 *                 format: binary
 *                 description: Ficha técnica de la bomba 1 (PDF, máx 5MB)
 *     responses:
 *       201:
 *         description: Piscina creada exitosamente
 *       400:
 *         description: Error de validación o archivos faltantes
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (requiere rol ADMIN)
 */
router.post(
  "/",
  authorize(UserRoles.ADMIN),
  validatePiscinaFiles,
  createPiscinaValidator,
  createPiscina,
);

/**
 * @swagger
 * /api/piscinas/{id}:
 *   put:
 *     summary: Actualizar piscina (solo ADMIN)
 *     description: Actualiza una piscina existente. Los archivos son opcionales, solo se actualizan si se envían.
 *     tags: [Piscinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la piscina a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               altura:
 *                 type: number
 *               ancho:
 *                 type: number
 *               ciudad:
 *                 type: string
 *               municipio:
 *                 type: string
 *               temperaturaExterna:
 *                 type: number
 *               categoria:
 *                 type: string
 *                 enum: [Niños, Adultos]
 *               totalProfundidades:
 *                 type: integer
 *               profundidades:
 *                 type: string
 *                 description: Array de profundidades en formato JSON
 *               forma:
 *                 type: string
 *                 enum: [Rectangular, Circular]
 *               uso:
 *                 type: string
 *                 enum: [Privada, Publica]
 *               filtros:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Nueva foto de la piscina (opcional, PNG o JPEG)
 *               bombas:
 *                 type: string
 *                 description: Array de bombas actualizado en formato JSON
 *               fotoBomba_0:
 *                 type: string
 *                 format: binary
 *                 description: Nueva foto de bomba (opcional)
 *               hojaSeguridad_0:
 *                 type: string
 *                 format: binary
 *                 description: Nueva hoja de seguridad (opcional, PDF)
 *               fichaTecnica_0:
 *                 type: string
 *                 format: binary
 *                 description: Nueva ficha técnica (opcional, PDF)
 *     responses:
 *       200:
 *         description: Piscina actualizada exitosamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Piscina no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (requiere rol ADMIN)
 */
router.put(
  "/:id",
  authorize(UserRoles.ADMIN),
  validateUpdatePiscinaFiles,
  updatePiscina,
);

/**
 * @swagger
 * /api/piscinas/{id}:
 *   delete:
 *     summary: Eliminar piscina (solo ADMIN)
 *     description: Elimina permanentemente una piscina por su ID
 *     tags: [Piscinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la piscina a eliminar
 *     responses:
 *       200:
 *         description: Piscina eliminada exitosamente
 *       404:
 *         description: Piscina no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (requiere rol ADMIN)
 */
router.delete("/:id", authorize(UserRoles.ADMIN), deletePiscina);

export default router;
