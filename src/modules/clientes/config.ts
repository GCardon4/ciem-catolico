import type { CampoCrud, ColumnaCrud } from "@/types/crud";

// Los nombres de campo y columna corresponden a la tabla customers
export const camposCliente: CampoCrud[] = [
  { nombre: "full_name", etiqueta: "Nombre completo", tipo: "texto", requerido: true },
  { nombre: "phone", etiqueta: "Teléfono / WhatsApp", tipo: "texto", requerido: true },
  { nombre: "city", etiqueta: "Ciudad", tipo: "texto" },
  { nombre: "address", etiqueta: "Dirección", tipo: "texto" },
];

export const columnasCliente: ColumnaCrud[] = [
  { clave: "full_name", etiqueta: "Nombre" },
  { clave: "phone", etiqueta: "Teléfono" },
  { clave: "city", etiqueta: "Ciudad" },
  { clave: "address", etiqueta: "Dirección" },
];
