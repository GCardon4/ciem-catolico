"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BotonesPaypal from "@/components/cart/BotonesPaypal";
import { formatearPrecio } from "@/lib/formato";
import { generarEnlaceWhatsapp } from "@/lib/whatsapp";
import { useCarrito } from "@/store/carrito";

interface CarritoCheckoutProps {
  idClientePaypal?: string;
  tasaCopPorUsd: number;
}

const estiloEntrada =
  "w-full px-3 py-2.5 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export default function CarritoCheckout({ idClientePaypal, tasaCopPorUsd }: CarritoCheckoutProps) {
  const { items, totalCop, cambiarCantidad, quitarDelCarrito, vaciarCarrito } = useCarrito();
  const [cliente, setCliente] = useState({ nombre: "", telefono: "", ciudad: "", direccion: "" });
  const [pedidoPagado, setPedidoPagado] = useState<number | null>(null);

  const totalUsd = Math.ceil((totalCop / tasaCopPorUsd) * 100) / 100;

  // actualizarCampo: guarda un dato del formulario de envío
  const actualizarCampo = (campo: keyof typeof cliente, valor: string) =>
    setCliente((valorActual) => ({ ...valorActual, [campo]: valor }));

  // validarFormulario: verifica que haya productos y datos de envío completos
  const validarFormulario = () =>
    items.length > 0 && Object.values(cliente).every((valor) => valor.trim().length > 0);

  // obtenerSolicitud: arma el cuerpo enviado al servidor (solo ids y cantidades; el precio lo calcula el servidor)
  const obtenerSolicitud = () => ({
    items: items.map((item) => ({ id: item.id, cantidad: item.cantidad })),
    cliente,
  });

  // registrarPago: muestra la confirmación y vacía el carrito
  const registrarPago = (pedidoId: number) => {
    vaciarCarrito();
    setPedidoPagado(pedidoId);
  };

  if (pedidoPagado !== null) {
    return (
      <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-4 py-12">
        <span className="text-5xl" aria-hidden="true">✓</span>
        <h1 className="font-display text-3xl text-primary">¡Pago recibido!</h1>
        <p className="text-on-surface-variant">
          Tu pedido <strong>#{pedidoPagado}</strong> fue confirmado. Nos pondremos en contacto contigo para
          coordinar el envío.
        </p>
        <a
          href={generarEnlaceWhatsapp(`Hola, acabo de pagar el pedido #${pedidoPagado} por PayPal.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary-container text-on-primary px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary"
        >
          Escribir por WhatsApp
        </a>
        <Link href="/" className="text-sm text-primary underline">Volver al inicio</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center flex flex-col items-center gap-4 py-16">
        <h1 className="font-display text-3xl text-primary">Tu carrito está vacío</h1>
        <Link
          href="/#catalogo"
          className="bg-primary-container text-on-primary px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <section className="lg:col-span-3 flex flex-col gap-4">
        <h1 className="font-display text-3xl text-primary">Tu carrito</h1>
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3"
            >
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-surface-container">
                {item.imagen && (
                  <Image src={item.imagen} alt={item.nombre} fill sizes="80px" className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <Link href={`/producto/${item.id}`} className="font-medium text-primary truncate">
                    {item.nombre}
                  </Link>
                  <button
                    type="button"
                    aria-label="Quitar"
                    onClick={() => quitarDelCarrito(item.id)}
                    className="text-on-surface-variant hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-outline-variant rounded-full text-sm">
                    <button
                      type="button"
                      aria-label="Restar"
                      onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                      className="w-8 h-8"
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{item.cantidad}</span>
                    <button
                      type="button"
                      aria-label="Sumar"
                      onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                      className="w-8 h-8"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-primary">
                    {formatearPrecio(item.precio * item.cantidad)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-primary/10 p-5 md:p-6 flex flex-col gap-4 h-fit">
        <h2 className="font-display text-xl text-primary">Datos de envío</h2>
        {(
          [
            ["nombre", "Nombre completo"],
            ["telefono", "Teléfono / WhatsApp"],
            ["ciudad", "Ciudad"],
            ["direccion", "Dirección"],
          ] as const
        ).map(([campo, etiqueta]) => (
          <label key={campo} className="flex flex-col gap-1 text-sm text-on-surface-variant">
            {etiqueta}
            <input
              value={cliente[campo]}
              onChange={(evento) => actualizarCampo(campo, evento.target.value)}
              autoComplete={campo === "telefono" ? "tel" : undefined}
              className={estiloEntrada}
            />
          </label>
        ))}

        <div className="border-t border-outline-variant/30 pt-4 flex flex-col gap-1">
          <div className="flex justify-between text-lg font-semibold text-primary">
            <span>Total</span>
            <span>{formatearPrecio(totalCop)}</span>
          </div>
          <p className="text-xs text-on-surface-variant">
            PayPal cobra en dólares: se cargarán aprox. <strong>US$ {totalUsd.toFixed(2)}</strong> (tasa{" "}
            {formatearPrecio(tasaCopPorUsd)} por dólar).
          </p>
        </div>

        {idClientePaypal ? (
          <BotonesPaypal
            idCliente={idClientePaypal}
            validar={validarFormulario}
            obtenerSolicitud={obtenerSolicitud}
            alPagar={registrarPago}
          />
        ) : (
          <p className="text-sm text-red-700">El pago con PayPal aún no está configurado.</p>
        )}
      </aside>
    </div>
  );
}
