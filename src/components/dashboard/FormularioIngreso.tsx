"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearClienteNavegador } from "@/lib/supabase/client";

const estiloEntrada =
  "w-full px-3 py-2.5 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export default function FormularioIngreso() {
  const enrutador = useRouter();
  const [mensajeError, setMensajeError] = useState("");
  const [cargando, setCargando] = useState(false);

  // iniciarSesion: valida las credenciales con Supabase y entra al dashboard
  const iniciarSesion = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setMensajeError("");
    setCargando(true);
    const formData = new FormData(evento.currentTarget);
    const supabase = crearClienteNavegador();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("correo")),
      password: String(formData.get("clave")),
    });
    if (error) {
      setMensajeError("Correo o contraseña incorrectos");
      setCargando(false);
      return;
    }
    // El proxy valida el rol: si no es admin vuelve a /ingresar con aviso
    enrutador.replace("/dashboard");
    enrutador.refresh();
  };

  return (
    <form onSubmit={iniciarSesion} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
        Correo
        <input name="correo" type="email" required autoComplete="email" className={estiloEntrada} />
      </label>
      <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
        Contraseña
        <input name="clave" type="password" required autoComplete="current-password" className={estiloEntrada} />
      </label>
      {mensajeError && <p className="text-sm text-red-700">{mensajeError}</p>}
      <button
        type="submit"
        disabled={cargando}
        className="bg-primary-container text-on-primary py-2.5 rounded-full text-sm font-semibold hover:bg-primary transition-colors disabled:opacity-50"
      >
        {cargando ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
