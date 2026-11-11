import { crearClienteServidor } from "@/lib/supabase/server";

const zonaHoraria = "America/Bogota";

export interface VentaDiaria {
  dia: string;
  etiqueta: string;
  total: number;
}

export interface PedidoReciente {
  id: number;
  cliente: string;
  estado: string;
  total: number;
  fecha: string;
}

// esSoloFecha: indica si el valor viene como AAAA-MM-DD (columna tipo date) sin hora
const esSoloFecha = (valor: string) => valor.length === 10;

// obtenerClaveDia: convierte una fecha a AAAA-MM-DD en la zona horaria de Colombia
const obtenerClaveDia = (valor: string | Date) => {
  if (typeof valor === "string" && esSoloFecha(valor)) return valor;
  return new Date(valor).toLocaleDateString("en-CA", { timeZone: zonaHoraria });
};

// formatearFecha: muestra la fecha del pedido en la zona horaria de Colombia
const formatearFecha = (valor: string) =>
  esSoloFecha(valor)
    ? new Date(`${valor}T00:00:00Z`).toLocaleDateString("es-CO", { timeZone: "UTC", dateStyle: "medium" })
    : new Date(valor).toLocaleString("es-CO", { timeZone: zonaHoraria, dateStyle: "medium", timeStyle: "short" });

// obtenerNombre: extrae el nombre de una relación que puede llegar como objeto o lista
const obtenerNombre = (relacion: unknown, campo: string) => {
  const registro = Array.isArray(relacion) ? relacion[0] : relacion;
  return (registro as Record<string, string> | null | undefined)?.[campo];
};

// obtenerEstadisticas: calcula ventas, pedidos y productos más vendidos para el panel principal
export const obtenerEstadisticas = async () => {
  const supabase = await crearClienteServidor();

  const [pedidosRespuesta, itemsRespuesta, clientesRespuesta, productosRespuesta] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total_amount, status, created_at, customers(full_name)")
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase.from("order_items").select("order_id, quantity, unit_price, products(name)"),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).lte("stock", 5),
  ]);

  const pedidos = pedidosRespuesta.data ?? [];
  const vigentes = pedidos.filter((pedido) => pedido.status !== "cancelled");
  const idsVigentes = new Set(vigentes.map((pedido) => pedido.id));

  const totalVentas = vigentes.reduce((suma, pedido) => suma + Number(pedido.total_amount), 0);

  // Ventas de los últimos 7 días
  const ventasDiarias: VentaDiaria[] = [];
  for (let desfase = 6; desfase >= 0; desfase--) {
    const fecha = new Date(Date.now() - desfase * 24 * 60 * 60 * 1000);
    ventasDiarias.push({
      dia: obtenerClaveDia(fecha),
      etiqueta: fecha.toLocaleDateString("es-CO", { weekday: "short", timeZone: zonaHoraria }),
      total: 0,
    });
  }
  for (const pedido of vigentes) {
    const registro = ventasDiarias.find((venta) => venta.dia === obtenerClaveDia(pedido.created_at));
    if (registro) registro.total += Number(pedido.total_amount);
  }

  // Productos más vendidos
  const acumulado = new Map<string, { nombre: string; unidades: number; ingresos: number }>();
  for (const item of itemsRespuesta.data ?? []) {
    if (!idsVigentes.has(item.order_id)) continue;
    const nombre = obtenerNombre(item.products, "name") ?? "Producto eliminado";
    const actual = acumulado.get(nombre) ?? { nombre, unidades: 0, ingresos: 0 };
    actual.unidades += Number(item.quantity);
    actual.ingresos += Number(item.quantity) * Number(item.unit_price);
    acumulado.set(nombre, actual);
  }
  const masVendidos = [...acumulado.values()].sort((a, b) => b.unidades - a.unidades).slice(0, 5);

  const pedidosRecientes: PedidoReciente[] = pedidos.slice(0, 8).map((pedido) => ({
    id: pedido.id,
    cliente: obtenerNombre(pedido.customers, "full_name") ?? "Sin cliente",
    estado: pedido.status,
    total: Number(pedido.total_amount),
    fecha: formatearFecha(pedido.created_at),
  }));

  return {
    totalVentas,
    totalPedidos: pedidos.length,
    pedidosPendientes: pedidos.filter((pedido) => pedido.status === "pending").length,
    ticketPromedio: vigentes.length ? totalVentas / vigentes.length : 0,
    totalClientes: clientesRespuesta.count ?? 0,
    stockCritico: productosRespuesta.count ?? 0,
    ventasDiarias,
    masVendidos,
    pedidosRecientes,
  };
};
