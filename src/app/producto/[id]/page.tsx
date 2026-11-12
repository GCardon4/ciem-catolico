import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import BotonAgregarCarrito from "@/components/cart/BotonAgregarCarrito";
import GaleriaProducto from "@/components/product/GaleriaProducto";
import { formatearPrecio } from "@/lib/formato";
import { generarEnlaceWhatsapp } from "@/lib/whatsapp";
import { obtenerProductoPorId } from "@/modules/products/queries";

export const revalidate = 60;

type Propiedades = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Propiedades): Promise<Metadata> {
  const { id } = await params;
  const producto = await obtenerProductoPorId(id);
  if (!producto) return { title: "Producto no encontrado | Ciem Santa Hildegarda" };
  return {
    title: `${producto.nombre} | Ciem Santa Hildegarda`,
    description: producto.descripcion.slice(0, 160),
    openGraph: producto.imagen ? { images: [producto.imagen] } : undefined,
  };
}

export default async function PaginaProducto({ params }: Propiedades) {
  const { id } = await params;
  const producto = await obtenerProductoPorId(id);
  if (!producto) notFound();

  const agotado = producto.stock <= 0;
  const mensajePedido = `Hola, me interesa la pieza "${producto.nombre}" (${formatearPrecio(producto.precio)}). ¿Está disponible?`;

  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="flex-1 py-10 md:py-16 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-(--container-max) mx-auto">
          <Link href="/#catalogo" className="text-sm text-on-surface-variant hover:text-primary">
            ← Volver al catálogo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mt-6">
            <GaleriaProducto
              imagenes={producto.imagenes}
              nombre={producto.nombre}
              categoria={producto.categoria}
            />

            <div className="flex flex-col gap-5">
              <span className="text-secondary tracking-widest uppercase text-sm font-semibold">
                {producto.categoria}
              </span>
              <h1 className="font-display text-3xl md:text-4xl text-primary">{producto.nombre}</h1>
              <p className="text-3xl font-semibold text-primary">{formatearPrecio(producto.precio)}</p>

              {producto.descripcion && (
                <p className="text-on-surface-variant whitespace-pre-line leading-relaxed">
                  {producto.descripcion}
                </p>
              )}

              <dl className="grid grid-cols-2 gap-4 text-sm border-t border-outline-variant/30 pt-5">
                {producto.sku && (
                  <div>
                    <dt className="text-on-surface-variant">Referencia (SKU)</dt>
                    <dd className="font-medium">{producto.sku}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-on-surface-variant">Disponibilidad</dt>
                  <dd className={`font-medium ${agotado ? "text-red-700" : "text-primary"}`}>
                    {agotado ? "Agotado" : producto.stock <= 5 ? `Últimas ${producto.stock} unidades` : "Disponible"}
                  </dd>
                </div>
              </dl>

              <BotonAgregarCarrito
                producto={{
                  id: producto.id,
                  nombre: producto.nombre,
                  precio: producto.precio,
                  imagen: producto.imagen,
                  stock: producto.stock,
                }}
              />

              <a
                href={generarEnlaceWhatsapp(mensajePedido)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline sm:self-start"
              >
                {agotado ? "Consultar disponibilidad por WhatsApp" : "¿Dudas? Escríbenos por WhatsApp"}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
