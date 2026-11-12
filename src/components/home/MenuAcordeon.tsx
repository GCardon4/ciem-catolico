"use client";

import { useState } from "react";
import { menuAcordeon } from "@/modules/home/menuAcordeon";

export default function MenuAcordeon() {
  const [abierto, setAbierto] = useState<string | null>(menuAcordeon[0].id);

  return (
    <section id="conoce-mas" className="py-16 md:py-20 px-margin-mobile md:px-margin-desktop bg-surface">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-secondary tracking-widest uppercase text-sm font-semibold mb-2 block">
            Conoce más
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-primary">Explora Ciem Santa Hildegarda</h2>
        </div>

        <div className="flex flex-col gap-3">
          {menuAcordeon.map((elemento, posicion) => {
            const expandido = abierto === elemento.id;
            const tieneContenido = elemento.subelementos.length > 0 || !!elemento.descripcion;
            return (
              <div
                key={elemento.id}
                className="bg-surface-container-lowest rounded-xl border border-secondary/20 overflow-hidden"
              >
                <h3>
                  <button
                    type="button"
                    id={`acordeon-${elemento.id}`}
                    aria-expanded={expandido}
                    aria-controls={`panel-${elemento.id}`}
                    onClick={() => setAbierto(expandido ? null : elemento.id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-container-low transition-colors"
                  >
                    <span className="flex items-center gap-4">
                      <span className="w-8 h-8 shrink-0 rounded-full bg-secondary-container/50 text-on-secondary-container flex items-center justify-center text-sm font-semibold">
                        {posicion + 1}
                      </span>
                      <span className="font-display text-lg md:text-xl text-primary">{elemento.titulo}</span>
                    </span>
                    {tieneContenido && (
                      <span
                        aria-hidden="true"
                        className={`text-primary text-xl transition-transform ${expandido ? "rotate-180" : ""}`}
                      >
                        ⌄
                      </span>
                    )}
                  </button>
                </h3>

                {tieneContenido && (
                  <div
                    id={`panel-${elemento.id}`}
                    role="region"
                    aria-labelledby={`acordeon-${elemento.id}`}
                    hidden={!expandido}
                    className="px-5 pb-5"
                  >
                    {elemento.descripcion && (
                      <p className="text-on-surface-variant pl-12">{elemento.descripcion}</p>
                    )}
                    <ul className="flex flex-col gap-1 pl-12">
                      {elemento.subelementos.map((sub, indiceSub) => (
                        <li key={sub.etiqueta}>
                          {sub.href ? (
                            <a href={sub.href} className="text-primary font-medium hover:underline">
                              {posicion + 1}.{indiceSub + 1} {sub.etiqueta}
                            </a>
                          ) : (
                            <span className="text-on-surface-variant">
                              {posicion + 1}.{indiceSub + 1} {sub.etiqueta}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
