"use client";

import { useState } from "react";
import Image from "next/image";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

interface GaleriaProductoProps {
  imagenes: string[];
  nombre: string;
  categoria: string;
}

export default function GaleriaProducto({ imagenes, nombre, categoria }: GaleriaProductoProps) {
  const [indiceActivo, setIndiceActivo] = useState(0);

  if (imagenes.length === 0) {
    return (
      <PlaceholderImage
        icono="✝"
        etiqueta={categoria}
        className="aspect-square w-full rounded-2xl border border-secondary/20"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-secondary/20 bg-surface-container-lowest">
        <Image
          src={imagenes[indiceActivo]}
          alt={`${nombre} - imagen ${indiceActivo + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {imagenes.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {imagenes.map((url, indice) => (
            <button
              key={url}
              type="button"
              onClick={() => setIndiceActivo(indice)}
              aria-label={`Ver imagen ${indice + 1}`}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                indice === indiceActivo ? "border-primary" : "border-transparent hover:border-secondary/50"
              }`}
            >
              <Image src={url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
