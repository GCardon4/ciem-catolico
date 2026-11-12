import SliderManager from "@/components/dashboard/SliderManager";
import { crearClienteServidor } from "@/lib/supabase/server";
import { eliminarSlide, guardarSlide } from "@/modules/slider/actions";
import type { SlideAdmin } from "@/types/slide";

export default async function PaginaSlider() {
  const supabase = await crearClienteServidor();
  const { data } = await supabase
    .from("hero_slides")
    .select("id, title, subtitle, button_label, link_url, image_url, position, active")
    .order("position")
    .order("id");

  return (
    <SliderManager slides={(data ?? []) as SlideAdmin[]} guardar={guardarSlide} eliminar={eliminarSlide} />
  );
}
