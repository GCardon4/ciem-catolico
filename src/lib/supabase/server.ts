import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// crearClienteServidor: crea el cliente de Supabase para componentes y acciones del servidor
export const crearClienteServidor = async () => {
  const almacenCookies = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => almacenCookies.getAll(),
        setAll: (cookiesAGuardar) => {
          try {
            cookiesAGuardar.forEach(({ name, value, options }) =>
              almacenCookies.set(name, value, options),
            );
          } catch {
            // En componentes de servidor las cookies son de solo lectura; el proxy las renueva
          }
        },
      },
    },
  );
};
