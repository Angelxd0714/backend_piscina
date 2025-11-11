import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
export enum UserRoles {
  ADMIN = "admin",
  USER = "user",
}
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export interface IUser extends Document {
  nombre: string;
  apellido: string;
  identificacion: string;
  correo: string;
  contraseña: string;
  roles: UserRoles[];
  estado: UserStatus;
  updatedAt: Date;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    identificacion: { type: String, required: true },
    correo: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "email is invalid"],
    },
    contraseña: {
      type: String,
      required: [true, "password is required"],
      minlength: 8,
    },
    roles: [
      { type: String, enum: Object.values(UserRoles), default: UserRoles.USER },
    ],
    estado: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
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
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.contraseña);
};

export const User = model<IUser>("User", userSchema);
