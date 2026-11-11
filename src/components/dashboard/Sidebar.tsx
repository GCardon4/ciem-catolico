"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const enlacesPanel = [
  { href: "/dashboard", etiqueta: "Panel Principal" },
  { href: "/dashboard/productos", etiqueta: "Productos" },
  { href: "/dashboard/categorias", etiqueta: "Categorías" },
  { href: "/dashboard/clientes", etiqueta: "Clientes" },
];

interface SidebarProps {
  nombreAdmin: string;
  cerrarSesion: () => Promise<void>;
}

export default function Sidebar({ nombreAdmin, cerrarSesion }: SidebarProps) {
  const rutaActual = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // alternarMenu: abre o cierra el menú lateral en móvil
  const alternarMenu = () => setMenuAbierto((valorActual) => !valorActual);

  return (
    <>
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-primary text-on-primary flex items-center justify-between px-4">
        <span className="font-display">Ciem Santa Hildegarda</span>
        <button type="button" aria-label="Abrir menú" onClick={alternarMenu} className="text-2xl">
          {menuAbierto ? "✕" : "☰"}
        </button>
      </div>

      <aside
        className={`fixed top-14 md:top-0 bottom-0 left-0 z-30 w-72 bg-primary text-on-primary flex flex-col p-6 gap-6 transition-transform md:translate-x-0 ${
          menuAbierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href="/" className="hidden md:flex items-center gap-3">
          <Image src="/logotipo.svg" alt="Logotipo" width={36} height={42} className="h-10 w-auto brightness-0 invert" />
          <span className="font-display uppercase text-sm tracking-wide">Ciem Santa Hildegarda</span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {enlacesPanel.map((enlace) => {
            const activo =
              enlace.href === "/dashboard" ? rutaActual === enlace.href : rutaActual.startsWith(enlace.href);
            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                onClick={() => setMenuAbierto(false)}
                className={`px-4 py-3 rounded-lg transition-colors ${
                  activo
                    ? "bg-secondary-container text-on-secondary-container font-bold"
                    : "text-on-primary-container hover:bg-white/10"
                }`}
              >
                {enlace.etiqueta}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/20 pt-4 flex flex-col gap-2">
          <p className="text-xs text-on-primary-container truncate">{nombreAdmin || "Administrador"}</p>
          <form action={cerrarSesion}>
            <button type="submit" className="w-full text-left px-4 py-3 rounded-lg text-on-primary-container hover:bg-white/10">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {menuAbierto && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={alternarMenu}
          className="md:hidden fixed inset-0 z-20 bg-black/40"
        />
      )}
    </>
  );
}
