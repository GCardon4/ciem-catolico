import type { CampoCrud } from "@/types/crud";

// obtenerCamposProducto: define los campos de la tabla products usados al guardar
export const obtenerCamposProducto = (): CampoCrud[] => [
  { nombre: "name", etiqueta: "Nombre", tipo: "texto", requerido: true },
  { nombre: "sku", etiqueta: "SKU", tipo: "texto" },
  { nombre: "description", etiqueta: "Descripción", tipo: "area" },
  { nombre: "price", etiqueta: "Precio (COP)", tipo: "numero", requerido: true },
  { nombre: "stock", etiqueta: "Stock", tipo: "numero", requerido: true },
  { nombre: "category_id", etiqueta: "Categoría", tipo: "seleccion" },
];
