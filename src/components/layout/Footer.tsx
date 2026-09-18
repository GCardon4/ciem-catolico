import { generarEnlaceWhatsapp } from "@/lib/whatsapp";

export default function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-highest w-full py-12 px-margin-mobile md:px-margin-desktop mt-auto">
      <div className="max-w-(--container-max) mx-auto grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div>
          <span className="font-display text-lg text-primary mb-3 block">
            Ciem Santa Hildegarda
          </span>
          <p className="text-sm text-on-surface-variant max-w-xs">
            Centro Católico Integral de Espiritualidad y Medicina.
          </p>
          <p className="text-sm text-on-surface-variant max-w-xs mt-1">
            © {anioActual} Ciem Santa Hildegarda. Sabiduría antigua, fe viva.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-primary mb-1">Navegación</span>
          <a href="#inicio" className="text-on-surface-variant hover:text-primary transition-colors">
            Inicio
          </a>
          <a href="#nuestra-esencia" className="text-on-surface-variant hover:text-primary transition-colors">
            Nuestra Historia
          </a>
          <a href="#catalogo" className="text-on-surface-variant hover:text-primary transition-colors">
            Catálogo
          </a>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-primary mb-1">Contacto</span>
          <a
            href={generarEnlaceWhatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            WhatsApp: +57 314 603 4091
          </a>
          <span className="text-on-surface-variant">Colombia</span>
        </div>
      </div>
    </footer>
  );
}
