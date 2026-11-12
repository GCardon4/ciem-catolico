"use server";

import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/auth";
import { crearClienteServidor } from "@/lib/supabase/server";
import type { ResultadoAccion } from "@/types/crud";

const bucket = "products";
const tamanoMaximoBytes = 1.5 * 1024 * 1024;

// refrescarSlider: invalida la página de inicio y el panel del slider
const refrescarSlider = () => {
  revalidatePath("/");
  revalidatePath("/dashboard/slider");
};

// obtenerRutaAlmacenamiento: extrae la ruta del archivo dentro del bucket a partir de su URL pública
const obtenerRutaAlmacenamiento = (url: string) => url.split(`/${bucket}/`)[1];

// guardarSlide: crea o edita una diapositiva y sube su imagen .webp si se envía una nueva
export async function guardarSlide(formData: FormData): Promise<ResultadoAccion> {
  await exigirAdmin();
  const titulo = String(formData.get("title") ?? "").trim();
  if (!titulo) return { error: "El título es obligatorio" };

  const enlace = String(formData.get("link_url") ?? "").trim();
  if (enlace && !/^(\/(?!\/)|https:\/\/)/.test(enlace)) {
    return { error: "El enlace debe empezar con / (interno) o https://" };
  }

  const id = formData.get("id");
  const archivo = formData.get("archivo");
  const hayArchivo = archivo instanceof File && archivo.size > 0;
  if (hayArchivo && (archivo.type !== "image/webp" || archivo.size > tamanoMaximoBytes)) {
    return { error: "La imagen debe ser .webp y pesar menos de 1.5 MB" };
  }
  if (!id && !hayArchivo) return { error: "Sube una imagen para la diapositiva" };

  const supabase = await crearClienteServidor();
  const datos: Record<string, string | number | boolean | null> = {
    title: titulo,
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,
    button_label: String(formData.get("button_label") ?? "").trim() || null,
    link_url: enlace || null,
    position: Number(formData.get("position")) || 0,
    active: formData.get("active") === "on",
  };

  let imagenAnterior: string | undefined;
  if (id) {
    const { data } = await supabase.from("hero_slides").select("image_url").eq("id", String(id)).maybeSingle();
    imagenAnterior = data?.image_url;
  }

  let rutaNueva: string | undefined;
  if (hayArchivo) {
    rutaNueva = `sliders/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    const { error: errorSubida } = await supabase.storage
      .from(bucket)
      .upload(rutaNueva, archivo, { contentType: "image/webp", cacheControl: "31536000" });
    if (errorSubida) return { error: errorSubida.message };
    datos.image_url = supabase.storage.from(bucket).getPublicUrl(rutaNueva).data.publicUrl;
  }

  const { error } = id
    ? await supabase.from("hero_slides").update(datos).eq("id", String(id))
    : await supabase.from("hero_slides").insert(datos);
  if (error) {
    if (rutaNueva) await supabase.storage.from(bucket).remove([rutaNueva]);
    return { error: error.message };
  }

  const rutaAnterior = hayArchivo && imagenAnterior ? obtenerRutaAlmacenamiento(imagenAnterior) : undefined;
  if (rutaAnterior) await supabase.storage.from(bucket).remove([rutaAnterior]);
  refrescarSlider();
  return {};
}

// eliminarSlide: elimina la diapositiva y su imagen
export async function eliminarSlide(id: string | number): Promise<ResultadoAccion> {
  await exigirAdmin();
  const supabase = await crearClienteServidor();
  const { data } = await supabase.from("hero_slides").select("image_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return { error: error.message };
  const ruta = data ? obtenerRutaAlmacenamiento(data.image_url) : undefined;
  if (ruta) await supabase.storage.from(bucket).remove([ruta]);
  refrescarSlider();
  return {};
}
