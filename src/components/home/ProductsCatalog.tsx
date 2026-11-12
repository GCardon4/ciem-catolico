import ProductCard from "@/components/home/ProductCard";
import { obtenerProductosPublicos } from "@/modules/products/queries";

export default async function ProductsCatalog() {
  const productos = await obtenerProductosPublicos();

  return (
    <section
      id="catalogo"
      className="py-20 md:py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low"
    >
      <div className="max-w-(--container-max) mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <span className="text-secondary tracking-widest uppercase text-sm font-semibold mb-2 block">
              Artesanía Sagrada
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">Nuestro Catálogo</h2>
            <p className="text-on-surface-variant">
              Piezas elaboradas con devoción, diseñadas para acompañar tu vida
              espiritual con elegancia y significado profundo.
            </p>
          </div>
        </div>

        {productos.length === 0 ? (
          <p className="text-center text-on-surface-variant py-12">
            Pronto compartiremos nuestras nuevas piezas.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
