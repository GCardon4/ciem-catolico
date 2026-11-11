import { redirect } from "next/navigation";
import { esRolAdmin } from "@/lib/roles";
import { crearClienteServidor } from "@/lib/supabase/server";

// obtenerAdminActual: retorna el usuario y perfil si es admin, o null si no tiene acceso
export const obtenerAdminActual = async () => {
  const supabase = await crearClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: perfil } = await supabase
    .from("profiles")
    .select("full_name, role_id")
    .eq("id", user.id)
    .maybeSingle();
  if (!perfil || !esRolAdmin(perfil.role_id)) return null;
  return { user, nombre: (perfil.full_name as string | null) ?? "" };
};

// exigirAdmin: redirige al ingreso si el usuario no es administrador
export const exigirAdmin = async () => {
  const admin = await obtenerAdminActual();
  if (!admin) redirect("/ingresar?error=sin-permiso");
  return admin;
};
