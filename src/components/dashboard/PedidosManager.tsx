"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatearPrecio } from "@/lib/formato";
import { generarEnlaceWhatsappCliente } from "@/lib/whatsapp";
import {
  coloresEstado,
  construirMensajeEstado,
  esEstadoPedido,
  estadosPedido,
  etiquetasEstado,
} from "@/modules/pedidos/estados";
import type { ResultadoAccion } from "@/types/crud";
import type { PedidoAdmin } from "@/types/pedido";

interface PedidosManagerProps {
  pedidos: PedidoAdmin[];
  cambiarEstado: (pedidoId: number | string, estado: string) => Promise<ResultadoAccion>;
}

const segundosActualizacion = 30;

export default function PedidosManager({ pedidos, cambiarEstado }: PedidosManagerProps) {
  const enrutador = useRouter();
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [abierto, setAbierto] = useState<number | null>(null);
  const [mensajeError, setMensajeError] = useState("");
  const [pendiente, iniciarTransicion] = useTransition();

  // Actualiza la lista automáticamente para ver los pedidos nuevos
  useEffect(() => {
    const intervalo = window.setInterval(() => enrutador.refresh(), segundosActualizacion * 1000);
    return () => window.clearInterval(intervalo);
  }, [enrutador]);

  const conteos = useMemo(() => {
    const total: Record<string, number> = { todos: pedidos.length };
    for (const pedido of pedidos) total[pedido.estado] = (total[pedido.estado] ?? 0) + 1;
    return total;
  }, [pedidos]);

  const pedidosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return pedidos.filter((pedido) => {
      if (filtroEstado !== "todos" && pedido.estado !== filtroEstado) return false;
      if (!termino) return true;
      return [String(pedido.id), pedido.cliente.nombre, pedido.cliente.telefono, pedido.cliente.ciudad].some(
        (valor) => valor.toLowerCase().includes(termino),
      );
    });
  }, [pedidos, filtroEstado, busqueda]);

  // cambiarEstadoPedido: guarda el nuevo estado del pedido
  const cambiarEstadoPedido = (pedidoId: number, estado: string) => {
    setMensajeError("");
    iniciarTransicion(async () => {
      const resultado = await cambiarEstado(pedidoId, estado);
      if (resultado.error) setMensajeError(resultado.error);
    });
  };

  // obtenerEnlaceWhatsapp: enlace para avisar al cliente el estado actual de su pedido
  const obtenerEnlaceWhatsapp = (pedido: PedidoAdmin) => {
    const estado = esEstadoPedido(pedido.estado) ? pedido.estado : "pending";
    return generarEnlaceWhatsappCliente(
      pedido.cliente.telefono,
      construirMensajeEstado(
        {
          id: pedido.id,
          cliente: pedido.cliente.nombre,
          total: pedido.total,
          ciudad: pedido.cliente.ciudad,
          direccion: pedido.cliente.direccion,
        },
        estado,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-5 max-w-(--container-max)">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary">Pedidos</h1>
          <p className="text-sm text-on-surface-variant">
            Pedidos realizados por los clientes · se actualiza cada {segundosActualizacion} s
          </p>
        </div>
        <button
          type="button"
          onClick={() => enrutador.refresh()}
          className="self-start sm:self-auto px-4 py-2 rounded-full border border-outline-variant text-sm text-on-surface-variant hover:bg-surface-container"
        >
          Actualizar
        </button>
      </header>

      <div className="flex flex-wrap gap-2">
        {["todos", ...estadosPedido].map((estado) => (
          <button
            key={estado}
            type="button"
            onClick={() => setFiltroEstado(estado)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              filtroEstado === estado
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {estado === "todos" ? "Todos" : etiquetasEstado[estado as keyof typeof etiquetasEstado]} (
            {conteos[estado] ?? 0})
          </button>
        ))}
      </div>

      <input
        type="search"
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
        placeholder="Buscar por número, cliente, teléfono o ciudad..."
        className="w-full sm:w-96 px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />

      {mensajeError && <p className="text-sm text-red-700 bg-error/10 rounded-lg p-3">{mensajeError}</p>}

      {pedidosFiltrados.length === 0 && (
        <p className="text-center text-on-surface-variant py-12">No hay pedidos para mostrar.</p>
      )}

      <ul className="flex flex-col gap-3">
        {pedidosFiltrados.map((pedido) => {
          const estadoValido = esEstadoPedido(pedido.estado);
          const expandido = abierto === pedido.id;
          return (
            <li
              key={pedido.id}
              className="bg-surface-container-lowest rounded-xl border border-primary/10 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setAbierto(expandido ? null : pedido.id)}
                aria-expanded={expandido}
                className="w-full flex flex-wrap items-center justify-between gap-3 p-4 text-left hover:bg-surface-container-low"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-primary">
                    Pedido #{pedido.id} · <span className="font-medium text-on-surface">{pedido.cliente.nombre}</span>
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {pedido.fecha} · {pedido.cliente.ciudad || "Sin ciudad"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      estadoValido ? coloresEstado[pedido.estado as keyof typeof coloresEstado] : ""
                    }`}
                  >
                    {estadoValido ? etiquetasEstado[pedido.estado as keyof typeof etiquetasEstado] : pedido.estado}
                  </span>
                  <span className="font-semibold">{formatearPrecio(pedido.total)}</span>
                </div>
              </button>

              {expandido && (
                <div className="border-t border-outline-variant/20 p-4 grid grid-cols-1 lg:grid-cols-3 gap-5 text-sm">
                  <section>
                    <h3 className="font-display text-primary mb-2">Cliente</h3>
                    <dl className="flex flex-col gap-1">
                      <div><dt className="inline text-on-surface-variant">Nombre: </dt><dd className="inline">{pedido.cliente.nombre}</dd></div>
                      <div><dt className="inline text-on-surface-variant">Teléfono: </dt><dd className="inline">{pedido.cliente.telefono || "—"}</dd></div>
                      <div><dt className="inline text-on-surface-variant">Ciudad: </dt><dd className="inline">{pedido.cliente.ciudad || "—"}</dd></div>
                      <div><dt className="inline text-on-surface-variant">Dirección: </dt><dd className="inline">{pedido.cliente.direccion || "—"}</dd></div>
                    </dl>
                    {pedido.pago && (
                      <div className="mt-4">
                        <h3 className="font-display text-primary mb-2">Pago</h3>
                        <p>
                          {pedido.pago.metodo} · {pedido.pago.estado}
                        </p>
                        <p className="text-on-surface-variant">
                          {pedido.pago.moneda} {pedido.pago.monto.toFixed(2)}
                          {pedido.pago.correo ? ` · ${pedido.pago.correo}` : ""}
                        </p>
                      </div>
                    )}
                  </section>

                  <section className="lg:col-span-2">
                    <h3 className="font-display text-primary mb-2">Productos</h3>
                    <div className="overflow-x-auto rounded-lg border border-outline-variant/30">
                      <table className="w-full text-left min-w-[420px]">
                        <thead className="bg-surface-container text-on-surface-variant">
                          <tr>
                            <th className="p-2 font-semibold">Producto</th>
                            <th className="p-2 font-semibold">Cant.</th>
                            <th className="p-2 font-semibold">Precio</th>
                            <th className="p-2 font-semibold text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedido.items.map((item, indice) => (
                            <tr key={indice} className="border-t border-outline-variant/10">
                              <td className="p-2">{item.nombre}</td>
                              <td className="p-2">{item.cantidad}</td>
                              <td className="p-2">{formatearPrecio(item.precioUnitario)}</td>
                              <td className="p-2 text-right">{formatearPrecio(item.subtotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-right font-semibold text-primary mt-2">
                      Total: {formatearPrecio(pedido.total)}
                    </p>
                  </section>

                  <div className="lg:col-span-3 flex flex-col sm:flex-row sm:items-end gap-3 border-t border-outline-variant/20 pt-4">
                    <label className="flex flex-col gap-1 text-on-surface-variant">
                      Cambiar estado
                      <select
                        value={pedido.estado}
                        disabled={pendiente}
                        onChange={(evento) => cambiarEstadoPedido(pedido.id, evento.target.value)}
                        className="px-3 py-2 bg-surface border border-outline-variant rounded-lg"
                      >
                        {estadosPedido.map((estado) => (
                          <option key={estado} value={estado}>
                            {etiquetasEstado[estado]}
                          </option>
                        ))}
                      </select>
                    </label>
                    {pedido.cliente.telefono ? (
                      <a
                        href={obtenerEnlaceWhatsapp(pedido)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary font-semibold text-center hover:bg-primary"
                      >
                        Avisar al cliente por WhatsApp
                      </a>
                    ) : (
                      <span className="text-on-surface-variant">El cliente no registró teléfono.</span>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
