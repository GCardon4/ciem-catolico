import { crearClientePublico } from "@/lib/supabase/publico";
import type { Product } from "@/types/product";

const columnasProducto =
  "id, name, sku, description, price, stock, category(name), images_product(id, image_url, main)";

type FilaProducto = {
  id: number | string;
  name: string;
  sku: string | null;
  description: string | null;
  price: number | string;
  stock: number | string;
  category: { name: string } | { name: string }[] | null;
  images_product: { id: number | string; image_url: string; main: boolean | null }[] | null;
};

// convertirProducto: transforma una fila de la base de datos en el producto público
const convertirProducto = (fila: FilaProducto): Product => {
  const categoria = Array.isArray(fila.category) ? fila.category[0] : fila.category;
  // La imagen marcada como principal va primero; el resto por orden de creación
  const imagenes = [...(fila.images_product ?? [])]
    .sort((a, b) => Number(!!b.main) - Number(!!a.main) || Number(a.id) - Number(b.id))
    .map((imagen) => imagen.image_url);
  return {
    id: String(fila.id),
    nombre: fila.name,
    descripcion: fila.description ?? "",
    precio: Number(fila.price),
    categoria: categoria?.name ?? "Sin categoría",
    sku: fila.sku ?? undefined,
    stock: Number(fila.stock),
    imagen: imagenes[0],
    imagenes,
  };
};

// obtenerProductosPublicos: lista los productos del catálogo, los más recientes primero
export const obtenerProductosPublicos = async (): Promise<Product[]> => {
  const { data, error } = await crearClientePublico()
    .from("products")
    .select(columnasProducto)
    .order("id", { ascending: false });
  if (error || !data) return [];
  return (data as unknown as FilaProducto[]).map(convertirProducto);
};

// obtenerProductoPorId: busca un producto por id, o null si no existe
export const obtenerProductoPorId = async (id: string): Promise<Product | null> => {
  if (!/^\d+$/.test(id)) return null;
  const { data } = await crearClientePublico()
    .from("products")
    .select(columnasProducto)
    .eq("id", id)
    .maybeSingle();
  return data ? convertirProducto(data as unknown as FilaProducto) : null;
};
