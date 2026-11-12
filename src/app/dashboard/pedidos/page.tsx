import PedidosManager from "@/components/dashboard/PedidosManager";
import { crearClienteServidor } from "@/lib/supabase/server";
import { formatearFecha } from "@/modules/dashboard/estadisticas";
import { actualizarEstadoPedido } from "@/modules/pedidos/actions";
import type { PedidoAdmin } from "@/types/pedido";

// primero: toma el primer elemento de una relación que puede llegar como objeto o lista
const primero = <T,>(relacion: T | T[] | null | undefined): T | undefined =>
  Array.isArray(relacion) ? relacion[0] : (relacion ?? undefined);

export default async function PaginaPedidos() {
  const supabase = await crearClienteServidor();
  const { data } = await supabase
    .from("orders")
    .select(
      `id, status, total_amount, created_at,
       customers(full_name, phone, city, address),
       order_items(quantity, unit_price, subtotal, products(name)),
       transactions(status, payment_method, amount, currency, payer_email)`,
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(300);

  const pedidos: PedidoAdmin[] = (data ?? []).map((fila) => {
    const cliente = primero(fila.customers as never) as Record<string, string> | undefined;
    const transaccion = primero(fila.transactions as never) as Record<string, string | number> | undefined;
    const items = (fila.order_items ?? []) as unknown as {
      quantity: number;
      unit_price: number;
      subtotal: number;
      products: { name: string } | { name: string }[] | null;
    }[];
    return {
      id: fila.id,
      estado: fila.status,
      total: Number(fila.total_amount),
      fecha: formatearFecha(fila.created_at),
      cliente: {
        nombre: cliente?.full_name ?? "Sin cliente",
        telefono: cliente?.phone ?? "",
        ciudad: cliente?.city ?? "",
        direccion: cliente?.address ?? "",
      },
      items: items.map((item) => ({
        nombre: primero(item.products)?.name ?? "Producto eliminado",
        cantidad: Number(item.quantity),
        precioUnitario: Number(item.unit_price),
        subtotal: Number(item.subtotal),
      })),
      pago: transaccion
        ? {
            estado: String(transaccion.status),
            metodo: String(transaccion.payment_method),
            monto: Number(transaccion.amount),
            moneda: String(transaccion.currency ?? "USD"),
            correo: (transaccion.payer_email as string | null) ?? null,
          }
        : null,
    };
  });

  return <PedidosManager pedidos={pedidos} cambiarEstado={actualizarEstadoPedido} />;
}
