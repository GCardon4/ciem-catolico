"use client";

import { useMemo, useSyncExternalStore } from "react";

export interface ItemCarrito {
  id: string;
  nombre: string;
  precio: number;
  imagen?: string;
  stock: number;
  cantidad: number;
}

const claveAlmacenamiento = "carritoCiem";
const escuchas = new Set<() => void>();

// leerCarritoTexto: obtiene el carrito guardado en el navegador como texto JSON
const leerCarritoTexto = () => {
  try {
    return window.localStorage.getItem(claveAlmacenamiento) ?? "[]";
  } catch {
    return "[]";
  }
};

// guardarCarrito: guarda el carrito en el navegador y avisa a los componentes suscritos
const guardarCarrito = (items: ItemCarrito[]) => {
  try {
    window.localStorage.setItem(claveAlmacenamiento, JSON.stringify(items));
  } catch {
    // Sin almacenamiento disponible: el carrito no se conserva entre visitas
  }
  escuchas.forEach((escucha) => escucha());
};

// suscribirseCarrito: registra un componente para recibir cambios del carrito
const suscribirseCarrito = (escucha: () => void) => {
  escuchas.add(escucha);
  window.addEventListener("storage", escucha);
  return () => {
    escuchas.delete(escucha);
    window.removeEventListener("storage", escucha);
  };
};

// leerItems: convierte el texto guardado en una lista de items válidos
const leerItems = (texto: string): ItemCarrito[] => {
  try {
    const datos = JSON.parse(texto);
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
};

// useCarrito: acceso al carrito de compras con sus acciones y totales
export const useCarrito = () => {
  const texto = useSyncExternalStore(suscribirseCarrito, leerCarritoTexto, () => "[]");
  const items = useMemo(() => leerItems(texto), [texto]);

  // agregarAlCarrito: suma unidades de un producto sin superar el stock
  const agregarAlCarrito = (producto: Omit<ItemCarrito, "cantidad">, cantidad = 1) => {
    const actuales = leerItems(leerCarritoTexto());
    const existente = actuales.find((item) => item.id === producto.id);
    if (existente) {
      existente.cantidad = Math.min(existente.cantidad + cantidad, producto.stock);
      existente.precio = producto.precio;
      existente.stock = producto.stock;
    } else {
      actuales.push({ ...producto, cantidad: Math.min(cantidad, producto.stock) });
    }
    guardarCarrito(actuales);
  };

  // cambiarCantidad: fija la cantidad de un producto del carrito
  const cambiarCantidad = (id: string, cantidad: number) => {
    guardarCarrito(
      leerItems(leerCarritoTexto()).map((item) =>
        item.id === id ? { ...item, cantidad: Math.max(1, Math.min(cantidad, item.stock)) } : item,
      ),
    );
  };

  // quitarDelCarrito: elimina un producto del carrito
  const quitarDelCarrito = (id: string) => {
    guardarCarrito(leerItems(leerCarritoTexto()).filter((item) => item.id !== id));
  };

  // vaciarCarrito: elimina todos los productos del carrito
  const vaciarCarrito = () => guardarCarrito([]);

  return {
    items,
    totalUnidades: items.reduce((suma, item) => suma + item.cantidad, 0),
    totalCop: items.reduce((suma, item) => suma + item.cantidad * item.precio, 0),
    agregarAlCarrito,
    cambiarCantidad,
    quitarDelCarrito,
    vaciarCarrito,
  };
};
