import type { CampoCrud, ColumnaCrud } from "@/types/crud";

// obtenerCamposProducto: arma los campos del formulario (tabla products) con las categorías disponibles
export const obtenerCamposProducto = (
  categorias: { id: string | number; name: string }[],
): CampoCrud[] => [
  { nombre: "name", etiqueta: "Nombre", tipo: "texto", requerido: true },
  { nombre: "sku", etiqueta: "SKU", tipo: "texto" },
  { nombre: "description", etiqueta: "Descripción", tipo: "area" },
  { nombre: "price", etiqueta: "Precio (COP)", tipo: "numero", requerido: true },
  { nombre: "stock", etiqueta: "Stock", tipo: "numero", requerido: true },
  {
    nombre: "category_id",
    etiqueta: "Categoría",
    tipo: "seleccion",
    opciones: categorias.map((categoria) => ({ valor: String(categoria.id), etiqueta: categoria.name })),
  },
];

export const columnasProducto: ColumnaCrud[] = [
  { clave: "name", etiqueta: "Nombre" },
  { clave: "sku", etiqueta: "SKU" },
  { clave: "categoria", etiqueta: "Categoría" },
  { clave: "stock", etiqueta: "Stock", formato: "stock" },
  { clave: "price", etiqueta: "Precio", formato: "moneda" },
];
