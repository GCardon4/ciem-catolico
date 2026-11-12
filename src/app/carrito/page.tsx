import type { Metadata } from "next";
import CarritoCheckout from "@/components/cart/CarritoCheckout";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { obtenerTasaCopPorUsd } from "@/lib/paypal";

export const metadata: Metadata = { title: "Carrito | Ciem Santa Hildegarda" };

// Lee las variables de entorno en cada solicitud (no se prerenderiza con valores de compilación)
export const dynamic = "force-dynamic";

export default function PaginaCarrito() {
  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="flex-1 py-10 md:py-14 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-(--container-max) mx-auto">
          <CarritoCheckout
            idClientePaypal={process.env.PAYPAL_CLIENT_ID}
            tasaCopPorUsd={obtenerTasaCopPorUsd()}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
