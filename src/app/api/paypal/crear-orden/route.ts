import { ErrorPaypal } from "@/lib/paypal";
import { crearPedidoYOrdenPaypal, ErrorPedido, validarSolicitud } from "@/modules/pedidos/servicio";

// POST: crea el pedido pendiente y la orden de PayPal; retorna el id de la orden
export async function POST(request: Request) {
  try {
    const { items, cliente } = validarSolicitud(await request.json().catch(() => null));
    const { ordenPaypalId, pedidoId } = await crearPedidoYOrdenPaypal(items, cliente);
    return Response.json({ id: ordenPaypalId, pedidoId });
  } catch (error) {
    if (error instanceof ErrorPedido || error instanceof ErrorPaypal) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("crear-orden", error);
    return Response.json({ error: "Error inesperado al crear el pago" }, { status: 500 });
  }
}
