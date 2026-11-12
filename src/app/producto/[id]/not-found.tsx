import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function ProductoNoEncontrado() {
  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center gap-4 py-24 px-margin-mobile text-center">
        <h1 className="font-display text-3xl text-primary">Producto no encontrado</h1>
        <p className="text-on-surface-variant">Es posible que ya no esté disponible en el catálogo.</p>
        <Link
          href="/#catalogo"
          className="bg-primary-container text-on-primary px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary"
        >
          Ver catálogo
        </Link>
      </main>
      <Footer />
    </div>
  );
}
