"use server";

import { eliminarRegistro, guardarRegistro } from "@/lib/crud";
import { camposCliente } from "./config";

// guardarCliente: crea o edita un cliente
export async function guardarCliente(formData: FormData) {
  return guardarRegistro("customers", formData, camposCliente, "/dashboard/clientes");
}

// eliminarCliente: elimina un cliente
export async function eliminarCliente(id: string | number) {
  return eliminarRegistro("customers", id, "/dashboard/clientes");
}
