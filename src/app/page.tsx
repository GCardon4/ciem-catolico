import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ProductsCatalog from "@/components/home/ProductsCatalog";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AboutSection />
        <ProductsCatalog />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
