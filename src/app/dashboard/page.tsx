import { obtenerEstadisticas } from "@/modules/dashboard/estadisticas";

const formatoMoneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const estilosEstado: Record<string, string> = {
  pending: "text-secondary",
  confirmed: "text-primary",
  cancelled: "text-red-700",
};

const etiquetasEstado: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
};

export default async function PaginaPanelPrincipal() {
  const estadisticas = await obtenerEstadisticas();
  const ventaMaxima = Math.max(...estadisticas.ventasDiarias.map((venta) => venta.total), 1);

  const tarjetas = [
    { etiqueta: "Ventas totales", valor: formatoMoneda.format(estadisticas.totalVentas) },
    { etiqueta: "Pedidos realizados", valor: String(estadisticas.totalPedidos) },
    { etiqueta: "Pedidos pendientes", valor: String(estadisticas.pedidosPendientes) },
    { etiqueta: "Ticket promedio", valor: formatoMoneda.format(estadisticas.ticketPromedio) },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-(--container-max)">
      <header>
        <h1 className="font-display text-2xl md:text-3xl text-primary">Panel Principal</h1>
        <p className="text-sm text-on-surface-variant">Resumen de ventas, productos y pedidos</p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tarjetas.map((tarjeta) => (
          <div
            key={tarjeta.etiqueta}
            className="bg-surface-container-lowest rounded-xl border border-primary/10 p-4 md:p-6"
          >
            <p className="text-xs md:text-sm text-on-surface-variant">{tarjeta.etiqueta}</p>
            <p className="font-display text-xl md:text-3xl text-primary mt-1 break-words">{tarjeta.valor}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-primary/10 p-4 md:p-6">
          <h2 className="font-display text-lg text-primary mb-4">Ventas de los últimos 7 días</h2>
          <div className="flex items-end gap-2 md:gap-4 h-48">
            {estadisticas.ventasDiarias.map((venta) => (
              <div key={venta.dia} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                <div
                  title={formatoMoneda.format(venta.total)}
                  className="w-full bg-primary-container rounded-t-md min-h-[2px]"
                  style={{ height: `${(venta.total / ventaMaxima) * 100}%` }}
                />
                <span className="text-xs text-on-surface-variant capitalize">{venta.etiqueta}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary text-on-primary rounded-xl p-6 flex flex-col justify-center gap-4">
          <div>
            <p className="text-sm opacity-80">Stock crítico (5 o menos)</p>
            <p className="font-display text-4xl">{estadisticas.stockCritico}</p>
            <p className="text-xs opacity-80">productos por reabastecer</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Clientes registrados</p>
            <p className="font-display text-4xl">{estadisticas.totalClientes}</p>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-surface-container-lowest rounded-xl border border-primary/10 p-4 md:p-6">
          <h2 className="font-display text-lg text-primary mb-4">Productos más vendidos</h2>
          {estadisticas.masVendidos.length === 0 ? (
            <p className="text-sm text-on-surface-variant">Aún no hay ventas registradas.</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {estadisticas.masVendidos.map((producto, indice) => (
                <li key={producto.nombre} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 shrink-0 rounded-full bg-secondary-container/40 text-on-secondary-container flex items-center justify-center font-semibold">
                      {indice + 1}
                    </span>
                    <span className="truncate">{producto.nombre}</span>
                  </span>
                  <span className="text-on-surface-variant whitespace-nowrap">
                    {producto.unidades} Und. · {formatoMoneda.format(producto.ingresos)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="bg-surface-container-lowest rounded-xl border border-primary/10 p-4 md:p-6">
          <h2 className="font-display text-lg text-primary mb-4">Pedidos recientes</h2>
          {estadisticas.pedidosRecientes.length === 0 ? (
            <p className="text-sm text-on-surface-variant">Aún no hay pedidos.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {estadisticas.pedidosRecientes.map((pedido) => (
                <li key={pedido.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium">
                      #{pedido.id} · <span className="truncate">{pedido.cliente}</span>
                    </p>
                    <p className="text-xs text-on-surface-variant">{pedido.fecha}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p>{formatoMoneda.format(pedido.total)}</p>
                    <p className={`text-xs font-medium ${estilosEstado[pedido.estado] ?? ""}`}>
                      {etiquetasEstado[pedido.estado] ?? pedido.estado}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
