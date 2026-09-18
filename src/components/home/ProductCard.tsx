import Image from "next/image";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { generarEnlaceWhatsapp } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

interface ProductCardProps {
  producto: Product;
}

export default function ProductCard({ producto }: ProductCardProps) {
  // construirMensajePedido: arma el texto precargado del pedido para el enlace de WhatsApp
  const construirMensajePedido = () =>
    `Hola, me interesa la pieza "${producto.nombre}" ($${producto.precio.toFixed(2)}). ¿Está disponible?`;

  return (
    <article className="bg-surface-container-lowest rounded-2xl border border-secondary/20 overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square">
        {producto.imagen ? (
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <PlaceholderImage
            icono="✝"
            etiqueta={producto.categoria}
            className="absolute inset-0"
          />
        )}
        {producto.etiqueta && (
          <span className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-semibold">
            {producto.etiqueta}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display text-lg text-primary mb-1">{producto.nombre}</h3>
        <p className="text-sm text-on-surface-variant mb-4 flex-grow">
          {producto.descripcion}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-primary">
            ${producto.precio.toFixed(2)}
          </span>
        </div>
        <a
          href={generarEnlaceWhatsapp(construirMensajePedido())}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-primary-container hover:bg-primary text-on-primary font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          Pedir por WhatsApp
        </a>
      </div>
    </article>
  );
}
