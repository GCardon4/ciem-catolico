import type { CampoCrud, ColumnaCrud } from "@/types/crud";

// Los nombres de campo y columna corresponden a la tabla category
export const camposCategoria: CampoCrud[] = [
  { nombre: "name", etiqueta: "Nombre", tipo: "texto", requerido: true },
  { nombre: "description", etiqueta: "Descripción", tipo: "area" },
];

export const columnasCategoria: ColumnaCrud[] = [
  { clave: "name", etiqueta: "Nombre" },
  { clave: "description", etiqueta: "Descripción" },
];
