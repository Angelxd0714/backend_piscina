import cloudinary from "cloudinary";
import { UploadedFile } from "express-fileupload";

export const uploadFile = async (file: UploadedFile) => {
  const { path } = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "uploads",
    resource_type: "auto",
  });
  return path;
};

export const deleteFile = async (publicId: string) => {
  await cloudinary.v2.uploader.destroy(publicId);
};

export const updateFile = async (file: UploadedFile, publicId: string) => {
  await cloudinary.v2.uploader.destroy(publicId);
  const { path } = await cloudinary.v2.uploader.upload(file.tempFilePath);
  return path;
};
