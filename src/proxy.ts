import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { esRolAdmin } from "@/lib/roles";

// proxy: protege /dashboard (solo admin con perfil) y renueva la sesión de Supabase
export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesAGuardar) => {
          cookiesAGuardar.forEach(({ name, value }) => request.cookies.set(name, value));
          respuesta = NextResponse.next({ request });
          cookiesAGuardar.forEach(({ name, value, options }) =>
            respuesta.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  let esAdmin = false;
  if (user) {
    const { data: perfil } = await supabase
      .from("profiles")
      .select("role_id")
      .eq("id", user.id)
      .maybeSingle();
    esAdmin = esRolAdmin(perfil?.role_id);
  }

  // redirigir: conserva las cookies de sesión renovadas en la redirección
  const redirigir = (ruta: string) => {
    const destino = NextResponse.redirect(new URL(ruta, request.url));
    respuesta.cookies.getAll().forEach((cookie) => destino.cookies.set(cookie));
    return destino;
  };

  if (pathname.startsWith("/dashboard") && !esAdmin) {
    return redirigir(user ? "/ingresar?error=sin-permiso" : "/ingresar");
  }
  if (pathname === "/ingresar" && esAdmin) return redirigir("/dashboard");

  return respuesta;
}

export const config = {
  matcher: ["/dashboard/:path*", "/ingresar"],
};
