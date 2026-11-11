"use server";

import { eliminarRegistro, guardarRegistro } from "@/lib/crud";
import { camposCategoria } from "./config";

// guardarCategoria: crea o edita una categoría
export async function guardarCategoria(formData: FormData) {
  return guardarRegistro("category", formData, camposCategoria, "/dashboard/categorias");
}

// eliminarCategoria: elimina una categoría
export async function eliminarCategoria(id: string | number) {
  return eliminarRegistro("category", id, "/dashboard/categorias");
}
