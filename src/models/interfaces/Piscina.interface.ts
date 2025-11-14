import { Schema, model, Document } from "mongoose";
import { Categoria, Forma, Tipo, MaterialBomba } from "../dto/Psicina.enum";

export interface IBomba {
  marca: string;
  referencia: string;
  fotoBomba?: string;
  potencia: number;
  material: MaterialBomba;
  seRepite: "si" | "no";
  totalBombas?: number;
  hojaSeguridad?: string;
  fichaTecnica?: string;
}
export interface IPiscina extends Document {
  nombre: string;
  direccion: string;
  altura: number;
  ancho: number;
  ciudad: string;
  municipio: string;
  temperaturaExterna: number;
  categoria: Categoria;
  totalProfundidades: number;
  profundidades: number[];
  forma: Forma;
  uso: Tipo;
  foto: string;
  bombas: IBomba[];
  filtros: string;
  createdAt: Date;
  updatedAt: Date;
}
