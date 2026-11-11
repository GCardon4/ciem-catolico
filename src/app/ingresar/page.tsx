import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FormularioIngreso from "@/components/dashboard/FormularioIngreso";

export const metadata: Metadata = { title: "Ingresar | Ciem Santa Hildegarda" };

export default async function PaginaIngresar({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-surface">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl border border-primary/10 p-6 md:p-8 shadow-[0px_10px_30px_rgba(27,73,44,0.06)]">
        <Link href="/" className="flex flex-col items-center gap-2 mb-6">
          <Image src="/logotipo.svg" alt="Logotipo Ciem Santa Hildegarda" width={52} height={60} className="h-14 w-auto" priority />
          <span className="font-display text-xl text-primary uppercase tracking-wide text-center">
            Ciem Santa Hildegarda
          </span>
        </Link>
        <h1 className="font-display text-2xl text-primary text-center mb-1">Ingresar</h1>
        <p className="text-sm text-on-surface-variant text-center mb-6">Acceso al panel de administración</p>
        {error === "sin-permiso" && (
          <p className="mb-4 text-sm text-red-700 bg-error/10 rounded-lg p-3">
            Tu cuenta no tiene permisos de administrador.
          </p>
        )}
        <FormularioIngreso />
      </div>
    </main>
  );
}
