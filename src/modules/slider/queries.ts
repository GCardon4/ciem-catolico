import { crearClientePublico } from "@/lib/supabase/publico";
import type { Slide } from "@/types/slide";

// obtenerSlidesActivos: lista las diapositivas activas del slider en su orden configurado
export const obtenerSlidesActivos = async (): Promise<Slide[]> => {
  const { data, error } = await crearClientePublico()
    .from("hero_slides")
    .select("id, title, subtitle, button_label, link_url, image_url")
    .eq("active", true)
    .order("position")
    .order("id");
  if (error || !data) return [];
  return data.map((fila) => ({
    id: fila.id,
    titulo: fila.title,
    subtitulo: fila.subtitle ?? "",
    etiquetaBoton: fila.button_label ?? "",
    enlace: fila.link_url ?? "",
    imagen: fila.image_url,
  }));
};
