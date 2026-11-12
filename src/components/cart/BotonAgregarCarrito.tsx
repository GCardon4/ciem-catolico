"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCarrito, type ItemCarrito } from "@/store/carrito";

interface BotonAgregarCarritoProps {
  producto: Omit<ItemCarrito, "cantidad">;
}

export default function BotonAgregarCarrito({ producto }: BotonAgregarCarritoProps) {
  const enrutador = useRouter();
  const { agregarAlCarrito } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  if (producto.stock <= 0) return null;

  // agregar: suma el producto al carrito y muestra confirmación breve
  const agregar = () => {
    agregarAlCarrito(producto, cantidad);
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 2000);
  };

  // comprarAhora: agrega el producto y va directo al pago
  const comprarAhora = () => {
    agregarAlCarrito(producto, cantidad);
    enrutador.push("/carrito");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-on-surface-variant">Cantidad</span>
        <div className="flex items-center border border-outline-variant rounded-full">
          <button
            type="button"
            aria-label="Restar"
            onClick={() => setCantidad((valor) => Math.max(1, valor - 1))}
            className="w-10 h-10 text-lg"
          >
            −
          </button>
          <span className="w-8 text-center font-medium">{cantidad}</span>
          <button
            type="button"
            aria-label="Sumar"
            onClick={() => setCantidad((valor) => Math.min(producto.stock, valor + 1))}
            className="w-10 h-10 text-lg"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={comprarAhora}
          className="bg-primary-container hover:bg-primary text-on-primary font-semibold px-8 py-3.5 rounded-full transition-colors"
        >
          Comprar ahora
        </button>
        <button
          type="button"
          onClick={agregar}
          className="border border-primary-container text-primary-container hover:bg-primary-container hover:text-on-primary font-semibold px-8 py-3.5 rounded-full transition-colors"
        >
          {agregado ? "✓ Agregado" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
