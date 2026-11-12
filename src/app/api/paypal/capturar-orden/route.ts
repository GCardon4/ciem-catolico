import { ErrorPaypal } from "@/lib/paypal";
import { confirmarPedidoPagado, ErrorPedido } from "@/modules/pedidos/servicio";

// POST: captura el pago aprobado en PayPal y confirma el pedido
export async function POST(request: Request) {
  try {
    const { orderId } = (await request.json().catch(() => ({}))) as { orderId?: unknown };
    if (typeof orderId !== "string" || !/^[A-Z0-9]{10,30}$/i.test(orderId)) {
      return Response.json({ error: "Orden inválida" }, { status: 400 });
    }
    const { pedidoId } = await confirmarPedidoPagado(orderId);
    return Response.json({ ok: true, pedidoId });
  } catch (error) {
    if (error instanceof ErrorPedido || error instanceof ErrorPaypal) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("capturar-orden", error);
    return Response.json({ error: "Error inesperado al confirmar el pago" }, { status: 500 });
  }
}
