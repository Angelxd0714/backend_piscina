import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import { UploadedFile } from "express-fileupload";
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (
  file: UploadedFile,
  folder = "uploads",
): Promise<{ url: string; publicId: string }> => {
  try {
    console.log("📤 Subiendo archivo:", {
      name: file.name,
      size: file.size,
      mimetype: file.mimetype,
      tempFilePath: file.tempFilePath,
      folder,
    });

    if (!file.tempFilePath) {
      throw new Error(
        "Archivo sin ruta temporal. Verifica express-fileupload con useTempFiles: true",
      );
    }

    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder,
      resource_type: "auto",
    });

    console.log("✅ Archivo subido:", result.secure_url);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    const errorStack = error instanceof Error ? error.stack : "";

    console.error("❌ Error subiendo archivo a Cloudinary:", {
      message: errorMessage,
      stack: errorStack,
      file: file?.name,
    });

    throw new Error(`Error al subir archivo: ${errorMessage}`);
  }
};

export const deleteFile = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.v2.uploader.destroy(publicId);
    console.log("🗑️ Archivo eliminado:", publicId);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Error eliminando archivo:", errorMessage);
  }
};
