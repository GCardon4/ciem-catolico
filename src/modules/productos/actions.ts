"use server";

import { eliminarRegistro, guardarRegistro } from "@/lib/crud";
import { obtenerCamposProducto } from "./config";

// guardarProducto: crea o edita un producto
export async function guardarProducto(formData: FormData) {
  return guardarRegistro("products", formData, obtenerCamposProducto([]), "/dashboard/productos");
}

// eliminarProducto: elimina un producto
export async function eliminarProducto(id: string | number) {
  return eliminarRegistro("products", id, "/dashboard/productos");
}
