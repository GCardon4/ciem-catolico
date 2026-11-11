import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/auth";
import { crearClienteServidor } from "@/lib/supabase/server";
import type { CampoCrud, ResultadoAccion } from "@/types/crud";

// convertirFormulario: transforma los datos del formulario en un objeto listo para la base de datos
const convertirFormulario = (formData: FormData, campos: CampoCrud[]) => {
  const datos: Record<string, string | number | boolean | null> = {};
  for (const campo of campos) {
    const valor = formData.get(campo.nombre);
    if (campo.tipo === "booleano") {
      datos[campo.nombre] = valor === "on";
    } else if (campo.tipo === "numero") {
      datos[campo.nombre] = valor === null || valor === "" ? 0 : Number(valor);
    } else {
      const texto = typeof valor === "string" ? valor.trim() : "";
      datos[campo.nombre] = texto === "" && !campo.requerido ? null : texto;
    }
  }
  return datos;
};

// guardarRegistro: crea o actualiza un registro de la tabla indicada (solo administradores)
export const guardarRegistro = async (
  tabla: string,
  formData: FormData,
  campos: CampoCrud[],
  ruta: string,
): Promise<ResultadoAccion> => {
  await exigirAdmin();
  const datos = convertirFormulario(formData, campos);
  for (const campo of campos) {
    if (campo.requerido && (datos[campo.nombre] === "" || datos[campo.nombre] === null)) {
      return { error: `El campo ${campo.etiqueta} es obligatorio` };
    }
  }
  const supabase = await crearClienteServidor();
  const id = formData.get("id");
  const { error } = id
    ? await supabase.from(tabla).update(datos).eq("id", String(id))
    : await supabase.from(tabla).insert(datos);
  if (error) {
    return { error: error.code === "23505" ? "Ya existe un registro con ese valor único" : error.message };
  }
  revalidatePath(ruta);
  return {};
};

// eliminarRegistro: borra un registro de la tabla indicada (solo administradores)
export const eliminarRegistro = async (
  tabla: string,
  id: string | number,
  ruta: string,
): Promise<ResultadoAccion> => {
  await exigirAdmin();
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from(tabla).delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(ruta);
  return {};
};
