"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const enlacesNavegacion = [
  { href: "#inicio", etiqueta: "Inicio" },
  { href: "#nuestra-esencia", etiqueta: "Nuestra Historia" },
  { href: "#catalogo", etiqueta: "Catálogo" },
];

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  // alternarMenuMovil: abre o cierra el menú de navegación en dispositivos móviles
  const alternarMenuMovil = () => setMenuAbierto((valorActual) => !valorActual);

  return (
    <nav className="bg-surface border-b border-outline-variant/20 sticky top-0 z-50">
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-(--container-max) mx-auto">
        <Link href="#inicio" className="flex items-center gap-3">
          <Image
            src="/logotipo.svg"
            alt="Logotipo Ciem Santa Hildegarda"
            width={44}
            height={51}
            className="h-11 w-auto"
            priority
          />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-xl text-primary uppercase tracking-wide">
              Ciem Santa Hildegarda
            </span>
            <span className="text-[11px] text-on-surface-variant tracking-wide">
              Centro Católico Integral de Espiritualidad y Medicina
            </span>
          </span>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {enlacesNavegacion.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              className="text-on-surface-variant hover:text-primary transition-colors font-medium text-sm"
            >
              {enlace.etiqueta}
            </a>
          ))}
        </div>

        <a
          href="#catalogo"
          className="hidden md:inline-flex items-center gap-2 bg-primary-container text-on-primary px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide hover:bg-primary transition-colors"
        >
          Ver Catálogo
        </a>

        <button
          type="button"
          aria-label="Abrir menú"
          className="md:hidden text-primary text-2xl"
          onClick={alternarMenuMovil}
        >
          {menuAbierto ? "✕" : "☰"}
        </button>
      </div>

      {menuAbierto && (
        <div className="md:hidden flex flex-col gap-4 px-margin-mobile pb-6 border-t border-outline-variant/20 bg-surface">
          {enlacesNavegacion.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              onClick={() => setMenuAbierto(false)}
              className="text-on-surface-variant hover:text-primary transition-colors font-medium pt-4"
            >
              {enlace.etiqueta}
            </a>
          ))}
          <a
            href="#catalogo"
            onClick={() => setMenuAbierto(false)}
            className="inline-flex justify-center items-center bg-primary-container text-on-primary px-6 py-2.5 rounded-full text-sm font-semibold"
          >
            Ver Catálogo
          </a>
        </div>
      )}
    </nav>
  );
}
