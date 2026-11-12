"use client";

import { useEffect, useRef, useState } from "react";

interface BotonesPaypalProps {
  idCliente: string;
  validar: () => boolean;
  obtenerSolicitud: () => unknown;
  alPagar: (pedidoId: number) => void;
}

interface BotonesSdk {
  render: (elemento: HTMLElement) => Promise<void>;
  close: () => Promise<void>;
}
type SdkPaypal = { Buttons: (configuracion: Record<string, unknown>) => BotonesSdk };

// cargarSdkPaypal: carga el script de PayPal una sola vez y retorna el SDK
const cargarSdkPaypal = (idCliente: string) =>
  new Promise<SdkPaypal>((resolver, rechazar) => {
    const existente = (window as unknown as { paypal?: SdkPaypal }).paypal;
    if (existente) return resolver(existente);
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(idCliente)}&currency=USD&intent=capture&locale=es_CO`;
    script.onload = () => resolver((window as unknown as { paypal: SdkPaypal }).paypal);
    script.onerror = () => rechazar(new Error("No se pudo cargar PayPal"));
    document.head.appendChild(script);
  });

export default function BotonesPaypal({ idCliente, validar, obtenerSolicitud, alPagar }: BotonesPaypalProps) {
  const contenedor = useRef<HTMLDivElement>(null);
  const funciones = useRef({ validar, obtenerSolicitud, alPagar });
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    funciones.current = { validar, obtenerSolicitud, alPagar };
  });

  useEffect(() => {
    let botones: BotonesSdk | undefined;
    let cancelado = false;

    cargarSdkPaypal(idCliente)
      .then((sdk) => {
        if (cancelado || !contenedor.current) return;
        botones = sdk.Buttons({
          style: { layout: "vertical", shape: "pill", label: "paypal" },
          // onClick: valida el formulario antes de abrir PayPal
          onClick: (_datos: unknown, acciones: { resolve: () => Promise<void>; reject: () => Promise<void> }) => {
            setMensajeError("");
            if (funciones.current.validar()) return acciones.resolve();
            setMensajeError("Completa los datos de envío para continuar");
            return acciones.reject();
          },
          // createOrder: pide al servidor crear el pedido y la orden de pago
          createOrder: async () => {
            const respuesta = await fetch("/api/paypal/crear-orden", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(funciones.current.obtenerSolicitud()),
            });
            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.error ?? "No se pudo crear el pago");
            return datos.id as string;
          },
          // onApprove: pide al servidor capturar el pago aprobado
          onApprove: async (datos: { orderID: string }) => {
            const respuesta = await fetch("/api/paypal/capturar-orden", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: datos.orderID }),
            });
            const resultado = await respuesta.json();
            if (!respuesta.ok) {
              setMensajeError(resultado.error ?? "No se pudo confirmar el pago");
              return;
            }
            funciones.current.alPagar(resultado.pedidoId);
          },
          onError: (error: Error) => setMensajeError(error.message || "Ocurrió un error con PayPal"),
        });
        return botones.render(contenedor.current);
      })
      .catch((error: Error) => setMensajeError(error.message));

    return () => {
      cancelado = true;
      botones?.close().catch(() => undefined);
    };
  }, [idCliente]);

  return (
    <div>
      <div ref={contenedor} />
      {mensajeError && <p className="mt-3 text-sm text-red-700">{mensajeError}</p>}
    </div>
  );
}
