import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Hero from "@/components/home/Hero";
import HeroSlider from "@/components/home/HeroSlider";
import MenuAcordeon from "@/components/home/MenuAcordeon";
import AboutSection from "@/components/home/AboutSection";
import VisualSupport from "@/components/home/VisualSupport";
import ProductsCatalog from "@/components/home/ProductsCatalog";
import { obtenerSlidesActivos } from "@/modules/slider/queries";

export const revalidate = 60;

export default async function Home() {
  const slides = await obtenerSlidesActivos();

  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="flex-1">
        {/* Si no hay diapositivas activas se muestra el Hero estático de siempre */}
        {slides.length > 0 ? <HeroSlider slides={slides} /> : <Hero />}
        <MenuAcordeon />
        <AboutSection />
        <VisualSupport />
        <ProductsCatalog />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
