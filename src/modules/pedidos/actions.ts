"use server";

import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/auth";
import { crearClienteServidor } from "@/lib/supabase/server";
import type { ResultadoAccion } from "@/types/crud";
import { esEstadoPedido } from "./estados";

// actualizarEstadoPedido: cambia el estado de un pedido (solo administradores)
export async function actualizarEstadoPedido(
  pedidoId: number | string,
  estado: string,
): Promise<ResultadoAccion> {
  await exigirAdmin();
  if (!esEstadoPedido(estado)) return { error: "Estado inválido" };
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("orders").update({ status: estado }).eq("id", pedidoId);
  if (error) {
    return {
      error: error.code === "23514"
        ? "La base de datos no permite este estado. Ejecuta el SQL de estados de pedido."
        : error.message,
    };
  }
  revalidatePath("/dashboard/pedidos");
  revalidatePath("/dashboard");
  return {};
}
