import PlaceholderImage from "@/components/ui/PlaceholderImage";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-surface-container-low"
    >
      <div className="max-w-(--container-max) mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="max-w-xl">
          <span className="text-secondary tracking-widest uppercase text-sm font-semibold mb-4 block">
            Sabiduría Antigua, Fe Viva
          </span>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-primary mb-6">
            Bisutería Católica hecha con devoción
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
            Medallas, rosarios y cruces inspirados en la tradición monástica de
            Santa Hildegarda, elaborados a mano para acompañar tu vida
            espiritual con elegancia.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#catalogo"
              className="bg-primary-container text-on-primary px-8 py-3 rounded-full font-semibold hover:bg-primary transition-colors"
            >
              Explorar Colección
            </a>
            <a
              href="#nuestra-esencia"
              className="border border-secondary text-secondary px-8 py-3 rounded-full font-semibold hover:bg-secondary/5 transition-colors"
            >
              Conocer Más
            </a>
          </div>
        </div>

        <PlaceholderImage
          icono="📿"
          etiqueta="Fotografía de bisutería católica (próximamente)"
          className="aspect-4/3 rounded-2xl border border-outline-variant/30"
        />
      </div>
    </section>
  );
}
