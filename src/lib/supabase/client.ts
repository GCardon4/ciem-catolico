import { createBrowserClient } from "@supabase/ssr";

// crearClienteNavegador: crea el cliente de Supabase para componentes del navegador
export const crearClienteNavegador = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
