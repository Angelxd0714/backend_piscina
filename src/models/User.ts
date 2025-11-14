import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { UserRoles, UserStatus } from "./dto/User.enum";
import { IUser } from "./interfaces/User.interface";

const userSchema = new Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: false },
    identificacion: { type: String, required: true },
    correo: {
      type: String,
      required: [true, "el correo es requerido"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "correo es invalido"],
    },
    password: {
      type: String,
      required: [true, "la contraseña es requerida"],
      minlength: 8,
    },
    rol: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.USER,
      required: true,
    },
    estado: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVO,
    },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = model<IUser>("User", userSchema);
