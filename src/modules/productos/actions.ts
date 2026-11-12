"use server";

import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/auth";
import { guardarRegistro } from "@/lib/crud";
import { crearClienteServidor } from "@/lib/supabase/server";
import type { ResultadoAccion } from "@/types/crud";
import { obtenerCamposProducto } from "./config";

const bucketProductos = "products";
const tamanoMaximoBytes = 1.5 * 1024 * 1024;
const rutaProductos = "/dashboard/productos";

// refrescarCatalogoPublico: invalida la página principal y las páginas de detalle del catálogo
const refrescarCatalogoPublico = () => {
  revalidatePath("/");
  revalidatePath("/producto/[id]", "page");
};

// obtenerRutaAlmacenamiento: extrae la ruta del archivo dentro del bucket a partir de su URL pública
const obtenerRutaAlmacenamiento = (url: string) => url.split(`/${bucketProductos}/`)[1];

// guardarProducto: crea o edita un producto y retorna su id
export async function guardarProducto(formData: FormData): Promise<ResultadoAccion> {
  const resultado = await guardarRegistro("products", formData, obtenerCamposProducto(), rutaProductos);
  if (!resultado.error) refrescarCatalogoPublico();
  return resultado;
}

// subirImagenProducto: sube una imagen .webp al almacenamiento y la asocia al producto
export async function subirImagenProducto(
  productoId: string | number,
  formData: FormData,
): Promise<ResultadoAccion> {
  await exigirAdmin();
  const archivo = formData.get("archivo");
  if (!(archivo instanceof File) || archivo.type !== "image/webp") {
    return { error: "Solo se permiten imágenes en formato .webp" };
  }
  if (archivo.size > tamanoMaximoBytes) return { error: "La imagen supera 1.5 MB" };

  const supabase = await crearClienteServidor();
  const ruta = `${productoId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const { error: errorSubida } = await supabase.storage
    .from(bucketProductos)
    .upload(ruta, archivo, { contentType: "image/webp", cacheControl: "31536000" });
  if (errorSubida) return { error: errorSubida.message };

  const { data: publica } = supabase.storage.from(bucketProductos).getPublicUrl(ruta);
  const esPrincipal = formData.get("principal") === "1";
  if (esPrincipal) {
    await supabase.from("images_product").update({ main: false }).eq("product_id", productoId);
  }
  const { error } = await supabase
    .from("images_product")
    .insert({ product_id: productoId, image_url: publica.publicUrl, main: esPrincipal });
  if (error) {
    await supabase.storage.from(bucketProductos).remove([ruta]);
    return { error: error.message };
  }
  await asegurarImagenPrincipal(productoId);
  revalidatePath(rutaProductos);
  refrescarCatalogoPublico();
  return {};
}

// asegurarImagenPrincipal: garantiza que el producto tenga una imagen principal si tiene imágenes
const asegurarImagenPrincipal = async (productoId: string | number) => {
  const supabase = await crearClienteServidor();
  const { data } = await supabase
    .from("images_product")
    .select("id, main")
    .eq("product_id", productoId)
    .order("id");
  if (data?.length && !data.some((imagen) => imagen.main)) {
    await supabase.from("images_product").update({ main: true }).eq("id", data[0].id);
  }
};

// marcarImagenPrincipal: define cuál imagen del producto se muestra en el grid y como portada
export async function marcarImagenPrincipal(
  productoId: string | number,
  imagenId: string | number,
): Promise<ResultadoAccion> {
  await exigirAdmin();
  const supabase = await crearClienteServidor();
  const { error: errorLimpieza } = await supabase
    .from("images_product")
    .update({ main: false })
    .eq("product_id", productoId);
  if (errorLimpieza) return { error: errorLimpieza.message };
  const { error } = await supabase
    .from("images_product")
    .update({ main: true })
    .eq("id", imagenId)
    .eq("product_id", productoId);
  if (error) return { error: error.message };
  revalidatePath(rutaProductos);
  refrescarCatalogoPublico();
  return {};
}

// eliminarImagenProducto: borra la imagen del almacenamiento y de la base de datos
export async function eliminarImagenProducto(imagenId: string | number): Promise<ResultadoAccion> {
  await exigirAdmin();
  const supabase = await crearClienteServidor();
  const { data: imagen } = await supabase
    .from("images_product")
    .select("image_url, product_id")
    .eq("id", imagenId)
    .maybeSingle();
  const { error } = await supabase.from("images_product").delete().eq("id", imagenId);
  if (error) return { error: error.message };
  const ruta = imagen ? obtenerRutaAlmacenamiento(imagen.image_url) : undefined;
  if (ruta) await supabase.storage.from(bucketProductos).remove([ruta]);
  if (imagen) await asegurarImagenPrincipal(imagen.product_id);
  revalidatePath(rutaProductos);
  refrescarCatalogoPublico();
  return {};
}

// eliminarProducto: elimina el producto junto con sus imágenes
export async function eliminarProducto(id: string | number): Promise<ResultadoAccion> {
  await exigirAdmin();
  const supabase = await crearClienteServidor();
  const { data: imagenes } = await supabase
    .from("images_product")
    .select("image_url")
    .eq("product_id", id);
  await supabase.from("images_product").delete().eq("product_id", id);
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    return {
      error: error.code === "23503"
        ? "No se puede eliminar: el producto tiene pedidos asociados"
        : error.message,
    };
  }
  const rutas = (imagenes ?? [])
    .map((imagen) => obtenerRutaAlmacenamiento(imagen.image_url))
    .filter(Boolean);
  if (rutas.length) await supabase.storage.from(bucketProductos).remove(rutas);
  revalidatePath(rutaProductos);
  refrescarCatalogoPublico();
  return {};
}
