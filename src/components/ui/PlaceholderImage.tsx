interface PlaceholderImageProps {
  icono: string;
  etiqueta: string;
  className?: string;
}

// PlaceholderImage: muestra un bloque decorativo mientras se cargan las fotografías reales del producto
export default function PlaceholderImage({ icono, etiqueta, className = "" }: PlaceholderImageProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary-container/15 via-secondary-container/20 to-surface-container-low text-center ${className}`}
    >
      <span className="text-4xl" aria-hidden="true">
        {icono}
      </span>
      <span className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold px-4">
        {etiqueta}
      </span>
    </div>
  );
}
