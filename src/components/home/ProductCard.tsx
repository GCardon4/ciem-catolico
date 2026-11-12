import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { formatearPrecio } from "@/lib/formato";
import type { Product } from "@/types/product";

interface ProductCardProps {
  producto: Product;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const agotado = producto.stock <= 0;

  return (
    <article className="bg-surface-container-lowest rounded-2xl border border-secondary/20 overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300">
      <Link href={`/producto/${producto.id}`} className="relative aspect-square block">
        {producto.imagen ? (
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <PlaceholderImage icono="✝" etiqueta={producto.categoria} className="absolute inset-0" />
        )}
        <span className="absolute top-4 left-4 bg-surface/90 text-primary px-3 py-1 rounded-full text-xs font-semibold">
          {producto.categoria}
        </span>
        {agotado && (
          <span className="absolute top-4 right-4 bg-error text-white px-3 py-1 rounded-full text-xs font-semibold">
            Agotado
          </span>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display text-lg text-primary mb-1">
          <Link href={`/producto/${producto.id}`} className="hover:underline">
            {producto.nombre}
          </Link>
        </h3>
        <p className="text-sm text-on-surface-variant mb-4 flex-grow line-clamp-3">
          {producto.descripcion}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-primary">{formatearPrecio(producto.precio)}</span>
        </div>
        <Link
          href={`/producto/${producto.id}`}
          className="w-full bg-primary-container hover:bg-primary text-on-primary font-semibold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          Ver detalles
        </Link>
      </div>
    </article>
  );
}
