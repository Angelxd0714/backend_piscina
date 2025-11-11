import cloudinary from "cloudinary";
import { UploadedFile } from "express-fileupload";

export const uploadFile = async (
  file: UploadedFile,
  folder = "uploads",
): Promise<{ url: string; publicId: string }> => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder,
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    throw new Error("Error al subir archivo a Cloudinary");
  }
};

export const deleteFile = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error eliminando archivo de Cloudinary:", error);
  }
};

export const updateFile = async (
  file: UploadedFile,
  publicId: string,
  folder = "uploads",
): Promise<{ url: string; publicId: string }> => {
  try {
    // Eliminar archivo anterior
    await cloudinary.v2.uploader.destroy(publicId);

    // Subir archivo nuevo
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder,
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    throw new Error("Error al actualizar archivo en Cloudinary");
  }
};
