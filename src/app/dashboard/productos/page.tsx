import CrudManager from "@/components/dashboard/CrudManager";
import { crearClienteServidor } from "@/lib/supabase/server";
import { eliminarProducto, guardarProducto } from "@/modules/productos/actions";
import { columnasProducto, obtenerCamposProducto } from "@/modules/productos/config";
import type { FilaCrud } from "@/types/crud";

export default async function PaginaProductos() {
  const supabase = await crearClienteServidor();
  const [productosRespuesta, categoriasRespuesta] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, sku, description, price, stock, category_id")
      .order("name"),
    supabase.from("category").select("id, name").order("name"),
  ]);

  const categorias = categoriasRespuesta.data ?? [];
  const nombresCategoria = new Map(categorias.map((categoria) => [categoria.id, categoria.name]));
  const filas = (productosRespuesta.data ?? []).map((producto) => ({
    ...producto,
    categoria: nombresCategoria.get(producto.category_id) ?? null,
  })) as FilaCrud[];

  return (
    <CrudManager
      titulo="Productos"
      subtitulo="Gestiona el catálogo, precios e inventario"
      singular="producto"
      filas={filas}
      columnas={columnasProducto}
      campos={obtenerCamposProducto(categorias)}
      guardar={guardarProducto}
      eliminar={eliminarProducto}
    />
  );
}
