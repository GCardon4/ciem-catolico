import { createClient } from "@supabase/supabase-js";

// crearClienteAdmin: cliente con la llave secreta (omite RLS). Solo para rutas del servidor de confianza
export const crearClienteAdmin = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
