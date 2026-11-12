"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Slide } from "@/types/slide";

interface HeroSliderProps {
  slides: Slide[];
}

const milisegundosPorSlide = 6000;
const distanciaMinimaDeslizar = 50;

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const inicioToque = useRef<number | null>(null);
  const total = slides.length;
  const indice = indiceActivo % total;

  // irA: muestra la diapositiva indicada de forma circular
  const irA = useCallback((nuevo: number) => setIndiceActivo((nuevo + total) % total), [total]);

  useEffect(() => {
    const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (total < 2 || pausado || reducirMovimiento) return;
    const temporizador = window.setInterval(() => setIndiceActivo((valor) => (valor + 1) % total), milisegundosPorSlide);
    return () => window.clearInterval(temporizador);
  }, [total, pausado]);

  // terminarToque: cambia de diapositiva al deslizar el dedo horizontalmente
  const terminarToque = (posicionFinal: number) => {
    if (inicioToque.current === null) return;
    const diferencia = posicionFinal - inicioToque.current;
    inicioToque.current = null;
    if (Math.abs(diferencia) >= distanciaMinimaDeslizar) irA(indice + (diferencia < 0 ? 1 : -1));
  };

  return (
    <section
      id="inicio"
      aria-roledescription="carrusel"
      aria-label="Destacados"
      className="relative w-full h-[65vh] min-h-[380px] max-h-[640px] overflow-hidden bg-primary"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      onTouchStart={(evento) => (inicioToque.current = evento.touches[0].clientX)}
      onTouchEnd={(evento) => terminarToque(evento.changedTouches[0].clientX)}
    >
      {slides.map((slide, posicion) => {
        const activo = posicion === indice;
        const esInterno = slide.enlace.startsWith("/");
        const claseBoton =
          "inline-flex bg-secondary-container text-on-secondary-container px-8 py-3 rounded-full font-semibold hover:brightness-105 transition";
        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${posicion + 1} de ${total}`}
            aria-hidden={!activo}
            className={`absolute inset-0 transition-opacity duration-700 ${activo ? "opacity-100 z-10" : "opacity-0 pointer-events-none"}`}
          >
            <Image
              src={slide.imagen}
              alt=""
              fill
              priority={posicion === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
            <div className="relative h-full max-w-(--container-max) mx-auto px-margin-mobile md:px-margin-desktop flex items-center">
              <div className="max-w-xl text-white">
                <h2 className="font-display text-3xl md:text-5xl leading-tight mb-4">{slide.titulo}</h2>
                {slide.subtitulo && (
                  <p className="text-base md:text-lg leading-relaxed mb-6 text-white/90">{slide.subtitulo}</p>
                )}
                {slide.enlace && slide.etiquetaBoton &&
                  (esInterno ? (
                    <Link href={slide.enlace} tabIndex={activo ? 0 : -1} className={claseBoton}>
                      {slide.etiquetaBoton}
                    </Link>
                  ) : (
                    <a
                      href={slide.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={activo ? 0 : -1}
                      className={claseBoton}
                    >
                      {slide.etiquetaBoton}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        );
      })}

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Diapositiva anterior"
            onClick={() => irA(indice - 1)}
            className="hidden sm:flex absolute z-20 left-3 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-black/40 text-white text-2xl hover:bg-black/60"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Diapositiva siguiente"
            onClick={() => irA(indice + 1)}
            className="hidden sm:flex absolute z-20 right-3 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-black/40 text-white text-2xl hover:bg-black/60"
          >
            ›
          </button>
          <div className="absolute z-20 bottom-4 inset-x-0 flex justify-center gap-2">
            {slides.map((slide, posicion) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Ir a la diapositiva ${posicion + 1}`}
                aria-current={posicion === indice}
                onClick={() => irA(posicion)}
                className={`h-2.5 rounded-full transition-all ${posicion === indice ? "w-8 bg-white" : "w-2.5 bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
