export type TipoCampo = "texto" | "numero" | "area" | "seleccion" | "booleano" | "correo";

export interface CampoCrud {
  nombre: string;
  etiqueta: string;
  tipo: TipoCampo;
  requerido?: boolean;
  opciones?: { valor: string; etiqueta: string }[];
}

export interface ColumnaCrud {
  clave: string;
  etiqueta: string;
  formato?: "texto" | "moneda" | "booleano" | "stock";
}

export interface ResultadoAccion {
  error?: string;
  id?: string | number;
}

export type FilaCrud = { id: string | number } & Record<string, string | number | boolean | null>;
