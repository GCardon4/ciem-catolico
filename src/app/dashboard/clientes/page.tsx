import CrudManager from "@/components/dashboard/CrudManager";
import { crearClienteServidor } from "@/lib/supabase/server";
import { eliminarCliente, guardarCliente } from "@/modules/clientes/actions";
import { camposCliente, columnasCliente } from "@/modules/clientes/config";
import type { FilaCrud } from "@/types/crud";

export default async function PaginaClientes() {
  const supabase = await crearClienteServidor();
  const { data } = await supabase
    .from("customers")
    .select("id, full_name, phone, city, address")
    .order("full_name");

  return (
    <CrudManager
      titulo="Clientes"
      subtitulo="Clientes identificados por teléfono o WhatsApp"
      singular="cliente"
      filas={(data ?? []) as FilaCrud[]}
      columnas={columnasCliente}
      campos={camposCliente}
      guardar={guardarCliente}
      eliminar={eliminarCliente}
    />
  );
}
