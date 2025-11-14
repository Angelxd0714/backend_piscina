import { Schema, model, Document } from "mongoose";
import { Categoria, Forma, Tipo, MaterialBomba } from "./dto/Psicina.enum";

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
const bombaSchema = new Schema<IBomba>(
  {
    marca: {
      type: String,
      required: [true, "La marca de la bomba es requerida"],
      trim: true,
    },
    referencia: {
      type: String,
      required: [true, "La referencia de la bomba es requerida"],
      trim: true,
    },
    fotoBomba: {
      type: String,
      required: false,
    },
    potencia: {
      type: Number,
      required: [true, "La potencia es requerida"],
      min: [0, "La potencia debe ser mayor a 0"],
    },
    material: {
      type: String,
      enum: Object.values(MaterialBomba),
      required: [true, "El material de la bomba es requerido"],
    },
    seRepite: {
      type: String,
      enum: ["si", "no"],
      required: true,
      default: "no",
    },
    totalBombas: {
      type: Number,
      min: [1, "El total de bombas debe ser al menos 1"],
      validate: {
        validator: function (this: IBomba, value: number) {
          if (this.seRepite === "si" && !value) {
            return false;
          }
          return true;
        },
        message: "El total de bombas es requerido cuando se repite la bomba",
      },
    },
    hojaSeguridad: {
      type: String,
      required: false,
    },
    fichaTecnica: {
      type: String,
      required: false,
    },
  },
  { _id: false },
);

const piscinaSchema = new Schema<IPiscina>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
    },
    direccion: {
      type: String,
      required: [true, "La dirección es requerida"],
      trim: true,
    },
    altura: {
      type: Number,
      required: [true, "La altura es requerida"],
      min: [0, "La altura debe ser mayor a 0"],
    },
    ancho: {
      type: Number,
      required: [true, "El ancho es requerido"],
      min: [0, "El ancho debe ser mayor a 0"],
    },
    ciudad: {
      type: String,
      required: [true, "La ciudad es requerida"],
      trim: true,
    },
    municipio: {
      type: String,
      required: [true, "El municipio es requerido"],
      trim: true,
    },
    temperaturaExterna: {
      type: Number,
      required: false,
    },
    categoria: {
      type: String,
      enum: Object.values(Categoria),
      required: [true, "La categoría es requerida"],
    },
    totalProfundidades: {
      type: Number,
      required: [true, "El total de profundidades es requerido"],
      min: [1, "Debe haber al menos 1 profundidad"],
    },
    profundidades: {
      type: [Number],
      required: [true, "Las profundidades son requeridas"],
    },
    forma: {
      type: String,
      enum: Object.values(Forma),
      required: [true, "La forma es requerida"],
    },
    uso: {
      type: String,
      enum: Object.values(Tipo),
      required: [true, "El uso es requerido"],
    },
    foto: {
      type: String,
      required: [true, "La foto es requerida"],
    },
    bombas: {
      type: [bombaSchema],
      required: [true, "Debe haber al menos 1 bomba"],
      validate: {
        validator: function (value: IBomba[]) {
          return value && value.length > 0;
        },
        message: "Debe agregar al menos una bomba",
      },
    },
    filtros: {
      type: String,
      required: [true, "Los filtros son requeridos"],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Piscina = model<IPiscina>("Piscina", piscinaSchema);

export default Piscina;
