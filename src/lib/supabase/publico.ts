import { createClient } from "@supabase/supabase-js";

// crearClientePublico: cliente sin sesión para leer el catálogo público (sin usar cookies)
export const crearClientePublico = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
