import { UserRoles, UserStatus } from "../dto/User.enum";
import { Document } from "mongoose";
export interface IUser extends Document {
  _id: any;
  nombre: string;
  apellido: string;
  identificacion: string;
  correo: string;
  contrasena: string;
  rol: UserRoles;
  estado: UserStatus;
  updatedAt: Date;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}
