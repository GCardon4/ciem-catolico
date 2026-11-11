import type { Metadata } from "next";
import Sidebar from "@/components/dashboard/Sidebar";
import { exigirAdmin } from "@/lib/auth";
import { cerrarSesion } from "@/modules/dashboard/actions";

export const metadata: Metadata = { title: "Panel de Administración | Ciem Santa Hildegarda" };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Segunda verificación de rol además del proxy
  const admin = await exigirAdmin();

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar nombreAdmin={admin.nombre} cerrarSesion={cerrarSesion} />
      <main className="md:ml-72 pt-20 md:pt-8 px-4 md:px-8 pb-8">{children}</main>
    </div>
  );
}
