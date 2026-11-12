import ProductosManager from "@/components/dashboard/ProductosManager";
import { crearClienteServidor } from "@/lib/supabase/server";
import {
  eliminarImagenProducto,
  eliminarProducto,
  guardarProducto,
  marcarImagenPrincipal,
  subirImagenProducto,
} from "@/modules/productos/actions";
import type { ProductoAdmin } from "@/types/product";

export default async function PaginaProductos() {
  const supabase = await crearClienteServidor();
  const [productosRespuesta, categoriasRespuesta] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, sku, description, price, stock, category_id, images_product(id, image_url, main)")
      .order("name"),
    supabase.from("category").select("id, name").order("name"),
  ]);

  return (
    <ProductosManager
      productos={(productosRespuesta.data ?? []) as unknown as ProductoAdmin[]}
      categorias={categoriasRespuesta.data ?? []}
      guardar={guardarProducto}
      eliminar={eliminarProducto}
      subirImagen={subirImagenProducto}
      eliminarImagen={eliminarImagenProducto}
      marcarPrincipal={marcarImagenPrincipal}
    />
  );
}
