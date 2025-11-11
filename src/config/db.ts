import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/piscinas";

    await mongoose.connect(mongoUri);

    console.log("MongoDB conectado correctamente");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1);
  }
};
