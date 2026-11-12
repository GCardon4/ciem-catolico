import { formatearPrecio } from "@/lib/formato";

export const estadosPedido = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
export type EstadoPedido = (typeof estadosPedido)[number];

export const etiquetasEstado: Record<EstadoPedido, string> = {
  pending: "Pendiente de pago",
  confirmed: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const coloresEstado: Record<EstadoPedido, string> = {
  pending: "bg-secondary-container/40 text-on-secondary-container",
  confirmed: "bg-primary-container/10 text-primary",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-primary-container text-on-primary",
  cancelled: "bg-error/10 text-red-700",
};

// esEstadoPedido: indica si un texto es un estado de pedido válido
export const esEstadoPedido = (valor: unknown): valor is EstadoPedido =>
  estadosPedido.includes(valor as EstadoPedido);

// estadoEsVenta: indica si el estado corresponde a un pedido pagado (cuenta como venta)
export const estadoEsVenta = (estado: string) =>
  estado === "confirmed" || estado === "shipped" || estado === "delivered";

interface DatosMensaje {
  id: number | string;
  cliente: string;
  total: number;
  ciudad: string;
  direccion: string;
}

// construirMensajeEstado: arma el mensaje de WhatsApp para informar al cliente el estado de su pedido
export const construirMensajeEstado = (pedido: DatosMensaje, estado: EstadoPedido) => {
  const saludo = `Hola ${pedido.cliente}, te escribimos de Ciem Santa Hildegarda.`;
  const referencia = `pedido #${pedido.id} por ${formatearPrecio(pedido.total)}`;
  const mensajes: Record<EstadoPedido, string> = {
    pending: `${saludo} Recibimos tu ${referencia}, pero el pago aún no se ha completado. ¿Necesitas ayuda para finalizarlo?`,
    confirmed: `${saludo} ¡Gracias por tu compra! Tu ${referencia} fue confirmado y lo estamos preparando. Te avisaremos cuando salga el envío.`,
    shipped: `${saludo} Tu ${referencia} ya fue enviado a ${pedido.direccion}, ${pedido.ciudad}. Pronto lo tendrás contigo.`,
    delivered: `${saludo} Tu ${referencia} fue entregado. ¡Gracias por confiar en nosotros! Que Santa Hildegarda te acompañe.`,
    cancelled: `${saludo} Tu ${referencia} fue cancelado. Si tienes dudas, escríbenos y con gusto te ayudamos.`,
  };
  return mensajes[estado];
};
