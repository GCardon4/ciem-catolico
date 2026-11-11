import CrudManager from "@/components/dashboard/CrudManager";
import { crearClienteServidor } from "@/lib/supabase/server";
import { eliminarCategoria, guardarCategoria } from "@/modules/categorias/actions";
import { camposCategoria, columnasCategoria } from "@/modules/categorias/config";
import type { FilaCrud } from "@/types/crud";

export default async function PaginaCategorias() {
  const supabase = await crearClienteServidor();
  const { data } = await supabase.from("category").select("id, name, description").order("name");

  return (
    <CrudManager
      titulo="Categorías"
      subtitulo="Organiza los productos del catálogo"
      singular="categoría"
      filas={(data ?? []) as FilaCrud[]}
      columnas={columnasCategoria}
      campos={camposCategoria}
      guardar={guardarCategoria}
      eliminar={eliminarCategoria}
    />
  );
}
