import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/db";
import { swaggerSpec } from "./config/swagger";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import piscinaRoutes from "./routes/piscina.routes";
import "./config/cloudinary";

dotenv.config();
console.log("🔍 authRoutes:", typeof authRoutes, authRoutes);
console.log("🔍 userRoutes:", typeof userRoutes, userRoutes);
console.log("🔍 piscinaRoutes:", typeof piscinaRoutes, piscinaRoutes);
const app: Application = express();

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: "El archivo excede el tamaño máximo permitido (5MB)",
  }),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((req, res, next) => {
  console.log(`📍 Petición: ${req.method} ${req.url}`);
  console.log(`   Headers: ${JSON.stringify(req.headers)}`);
  next();
});

// PASO 4: RUTAS - AQUÍ ES CRÍTICO
console.log("✅ Registrando rutas...");
app.use("/api/auth", authRoutes);
console.log("   ✓ /api/auth registrado");
app.use("/api/users", userRoutes);
console.log("   ✓ /api/users registrado");
app.use("/api/piscinas", piscinaRoutes);
console.log("   ✓ /api/piscinas registrado");

// PASO 5: Ruta raíz
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "API de Gestión de Piscinas",
    version: "1.0.0",
    docs: "/api-docs",
    routes: {
      auth: "/api/auth",
      users: "/api/users",
      piscinas: "/api/piscinas",
    },
  });
});

// PASO 6: 404 handler - AL FINAL
app.use((req: Request, res: Response) => {
  console.log(`❌ 404: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
    path: req.path,
    method: req.method,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`👥 Users: http://localhost:${PORT}/api/users`);
  console.log(`🏊 Piscinas: http://localhost:${PORT}/api/piscinas\n`);
});

export default app;
