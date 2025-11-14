import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_ATLAS || process.env.MONGO_URI || "";

    await mongoose.connect(mongoUri);

    console.log("MongoDB conectado correctamente");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1);
  }
};
