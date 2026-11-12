"use client";

import Image from "next/image";
import Link from "next/link";
import { useCarrito } from "@/store/carrito";

const estiloBoton =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors";

export default function Navbar() {
  const { totalUnidades } = useCarrito();

  return (
    <nav className="bg-surface border-b border-outline-variant/20 sticky top-0 z-50">
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-(--container-max) mx-auto">
        <Link href="/" className="flex items-center gap-3">
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
            <span className="hidden lg:block text-[11px] text-on-surface-variant tracking-wide">
              Centro Católico Integral de Espiritualidad y Medicina
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/carrito"
            aria-label={`Carrito de compras${totalUnidades > 0 ? `, ${totalUnidades} unidades` : ""}`}
            className={`${estiloBoton} relative w-10 h-10 text-primary hover:bg-primary/5`}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.76L19.5 8H6.2" />
              <circle cx="9" cy="19" r="1.4" />
              <circle cx="17" cy="19" r="1.4" />
            </svg>
            {totalUnidades > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-secondary text-on-secondary text-xs flex items-center justify-center">
                {totalUnidades}
              </span>
            )}
          </Link>

          <Link
            href="/ingresar"
            aria-label="Ingresar"
            className={`${estiloBoton} border border-primary-container text-primary-container hover:bg-primary-container hover:text-on-primary w-10 h-10 sm:w-auto sm:h-auto sm:px-6 sm:py-2.5`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="8" r="3.5" />
              <path strokeLinecap="round" d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
            </svg>
            <span className="hidden sm:inline">Ingresar</span>
          </Link>

          <Link
            href="/#catalogo"
            className={`${estiloBoton} bg-primary-container text-on-primary hover:bg-primary px-4 py-2.5 sm:px-6`}
          >
            Catálogo
          </Link>
        </div>
      </div>
    </nav>
  );
}
