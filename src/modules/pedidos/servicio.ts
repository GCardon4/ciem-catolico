import { capturarOrdenPaypal, convertirCopAUsd, crearOrdenPaypal, ErrorPaypal } from "@/lib/paypal";
import { crearClienteAdmin } from "@/lib/supabase/admin";

export interface ItemPedido {
  id: string;
  cantidad: number;
}

export interface DatosCliente {
  nombre: string;
  telefono: string;
  ciudad: string;
  direccion: string;
}

export class ErrorPedido extends Error {}

// limpiarTexto: recorta y limita el largo de un texto recibido del navegador
const limpiarTexto = (valor: unknown, maximo: number) =>
  typeof valor === "string" ? valor.trim().slice(0, maximo) : "";

// validarSolicitud: valida y normaliza los items y los datos del cliente recibidos
export const validarSolicitud = (cuerpo: unknown) => {
  const { items, cliente } = (cuerpo ?? {}) as { items?: unknown; cliente?: Record<string, unknown> };
  if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
    throw new ErrorPedido("El carrito está vacío");
  }
  const itemsValidos: ItemPedido[] = items.map((item) => {
    const cantidad = Number(item?.cantidad);
    if (!/^\d+$/.test(String(item?.id)) || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 50) {
      throw new ErrorPedido("Carrito inválido");
    }
    return { id: String(item.id), cantidad };
  });
  const datosCliente: DatosCliente = {
    nombre: limpiarTexto(cliente?.nombre, 120),
    telefono: limpiarTexto(cliente?.telefono, 30),
    ciudad: limpiarTexto(cliente?.ciudad, 80),
    direccion: limpiarTexto(cliente?.direccion, 200),
  };
  if (Object.values(datosCliente).some((valor) => !valor)) {
    throw new ErrorPedido("Completa todos los datos de envío");
  }
  return { items: itemsValidos, cliente: datosCliente };
};

// crearPedidoYOrdenPaypal: guarda el pedido pendiente con precios de la base y crea la orden de PayPal
export const crearPedidoYOrdenPaypal = async (items: ItemPedido[], cliente: DatosCliente) => {
  const supabase = crearClienteAdmin();

  // Agrupar cantidades por producto
  const cantidades = new Map<string, number>();
  for (const item of items) cantidades.set(item.id, (cantidades.get(item.id) ?? 0) + item.cantidad);

  const { data: productos } = await supabase
    .from("products")
    .select("id, name, price, stock")
    .in("id", [...cantidades.keys()]);
  if (!productos || productos.length !== cantidades.size) {
    throw new ErrorPedido("Algún producto ya no está disponible");
  }

  let totalCop = 0;
  const lineas = productos.map((producto) => {
    const cantidad = cantidades.get(String(producto.id))!;
    if (Number(producto.stock) < cantidad) {
      throw new ErrorPedido(`No hay suficiente stock de "${producto.name}"`);
    }
    const precio = Number(producto.price);
    totalCop += precio * cantidad;
    return { product_id: producto.id, quantity: cantidad, unit_price: precio, subtotal: precio * cantidad };
  });
  if (totalCop <= 0) throw new ErrorPedido("El total del pedido es inválido");

  // Cliente identificado por teléfono
  const { data: existente } = await supabase
    .from("customers")
    .select("id")
    .eq("phone", cliente.telefono)
    .maybeSingle();
  const datosCliente = {
    full_name: cliente.nombre,
    phone: cliente.telefono,
    city: cliente.ciudad,
    address: cliente.direccion,
  };
  let clienteId = existente?.id;
  if (clienteId) {
    await supabase.from("customers").update(datosCliente).eq("id", clienteId);
  } else {
    const { data, error } = await supabase.from("customers").insert(datosCliente).select("id").single();
    if (error) throw new ErrorPedido("No se pudo registrar el cliente");
    clienteId = data.id;
  }

  const { data: pedido, error: errorPedido } = await supabase
    .from("orders")
    .insert({ customer_id: clienteId, status: "pending", total_amount: totalCop })
    .select("id")
    .single();
  if (errorPedido) throw new ErrorPedido("No se pudo crear el pedido");

  const { error: errorItems } = await supabase
    .from("order_items")
    .insert(lineas.map((linea) => ({ ...linea, order_id: pedido.id })));
  if (errorItems) {
    await supabase.from("orders").update({ status: "cancelled" }).eq("id", pedido.id);
    throw new ErrorPedido("No se pudo guardar el detalle del pedido");
  }

  const montoUsd = convertirCopAUsd(totalCop);
  let ordenPaypalId: string;
  try {
    ordenPaypalId = await crearOrdenPaypal(montoUsd, String(pedido.id), `Pedido #${pedido.id} Ciem Santa Hildegarda`);
  } catch (error) {
    await supabase.from("orders").update({ status: "cancelled" }).eq("id", pedido.id);
    throw error instanceof ErrorPaypal ? error : new ErrorPedido("No se pudo iniciar el pago");
  }

  await supabase.from("transactions").insert({
    order_id: pedido.id,
    status: "pending",
    payment_method: "paypal",
    amount: Number(montoUsd),
    currency: "USD",
    paypal_order_id: ordenPaypalId,
  });

  return { ordenPaypalId, pedidoId: pedido.id as number };
};

// confirmarPedidoPagado: captura el pago en PayPal, confirma el pedido y descuenta el stock
export const confirmarPedidoPagado = async (ordenPaypalId: string) => {
  const supabase = crearClienteAdmin();
  const { data: transaccion } = await supabase
    .from("transactions")
    .select("id, order_id, status, amount")
    .eq("paypal_order_id", ordenPaypalId)
    .maybeSingle();
  if (!transaccion) throw new ErrorPedido("Orden de pago no encontrada");
  if (transaccion.status === "approved") return { pedidoId: transaccion.order_id as number };

  const pago = await capturarOrdenPaypal(ordenPaypalId);
  if (!pago.completado || pago.moneda !== "USD" || pago.monto < Number(transaccion.amount)) {
    await supabase.from("transactions").update({ status: "rejected" }).eq("id", transaccion.id);
    throw new ErrorPedido("El pago no pudo completarse");
  }

  await supabase
    .from("transactions")
    .update({ status: "approved", payer_email: pago.correoComprador })
    .eq("id", transaccion.id);
  await supabase.from("orders").update({ status: "confirmed" }).eq("id", transaccion.order_id);

  // Descontar stock de cada producto del pedido
  const { data: items } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", transaccion.order_id);
  for (const item of items ?? []) {
    const { data: producto } = await supabase.from("products").select("stock").eq("id", item.product_id).single();
    if (producto) {
      await supabase
        .from("products")
        .update({ stock: Math.max(0, Number(producto.stock) - Number(item.quantity)) })
        .eq("id", item.product_id);
    }
  }
  return { pedidoId: transaccion.order_id as number };
};
