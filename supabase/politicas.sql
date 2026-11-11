-- Políticas RLS para el dashboard. Ejecutar en Supabase > SQL Editor.
-- Supone: profiles.role_id -> roles.id, y role_id = 1 es el administrador.
-- Si cambia el id del admin, ajústalo aquí y en src/lib/roles.ts.

-- esAdmin: indica si el usuario autenticado tiene el rol admin (role_id = 1)
create or replace function public.esadmin() returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role_id = 1);
$$;

alter table profiles enable row level security;
alter table roles enable row level security;
alter table products enable row level security;
alter table category enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Cada usuario lee su propio perfil y su rol (necesario para validar el acceso)
create policy "perfilPropio" on profiles for select using (id = auth.uid() or public.esadmin());
create policy "rolesLectura" on roles for select using (auth.uid() is not null);

-- Catálogo público de solo lectura
create policy "categoriaPublica" on category for select using (true);
create policy "productosPublicos" on products for select using (true);

-- Administración completa
create policy "perfilesAdmin" on profiles for all using (public.esadmin()) with check (public.esadmin());
create policy "categoriaAdmin" on category for all using (public.esadmin()) with check (public.esadmin());
create policy "productosAdmin" on products for all using (public.esadmin()) with check (public.esadmin());
create policy "clientesAdmin" on customers for all using (public.esadmin()) with check (public.esadmin());
create policy "pedidosAdmin" on orders for all using (public.esadmin()) with check (public.esadmin());
create policy "itemsAdmin" on order_items for all using (public.esadmin()) with check (public.esadmin());
