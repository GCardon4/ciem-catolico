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

-- ===== Imágenes de productos =====
alter table images_product enable row level security;
create policy "imagenesPublicas" on images_product for select using (true);
create policy "imagenesAdmin" on images_product for all using (public.esadmin()) with check (public.esadmin());

-- Bucket público para las imágenes .webp
insert into storage.buckets (id, name, public) values ('products', 'products', true)
  on conflict (id) do update set public = true;

create policy "storageProductosLectura" on storage.objects for select
  using (bucket_id = 'products');
create policy "storageProductosAdmin" on storage.objects for all
  using (bucket_id = 'products' and public.esadmin())
  with check (bucket_id = 'products' and public.esadmin());

-- ===== Pagos con PayPal =====
-- Columnas adicionales en transactions para enlazar el pago con PayPal
alter table transactions add column if not exists paypal_order_id text unique;
alter table transactions add column if not exists currency text default 'USD';
alter table transactions add column if not exists payer_email text;

-- Los pedidos y transacciones se crean desde el servidor con la llave secreta (omite RLS).
-- Se mantiene RLS activo en estas tablas con acceso solo para administradores.
alter table transactions enable row level security;
create policy "transaccionesAdmin" on transactions for all using (public.esadmin()) with check (public.esadmin());

-- customers.phone debe ser único para identificar al cliente por teléfono (opcional, recomendado)
-- alter table customers add constraint clientesTelefonoUnico unique (phone);

-- ===== Estados de pedido =====
-- Agrega 'shipped' (enviado) y 'delivered' (entregado) a los estados permitidos.
-- Si tu tabla orders no tiene restricción en status, este bloque no cambia nada importante.
alter table orders drop constraint if exists orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'));

-- ===== Slider principal (hero) =====
create table if not exists hero_slides (
  id bigint generated always as identity primary key,
  title text not null,
  subtitle text,
  button_label text,
  link_url text,
  image_url text not null,
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table hero_slides enable row level security;
create policy "slidesPublicos" on hero_slides for select using (active or public.esadmin());
create policy "slidesAdmin" on hero_slides for all using (public.esadmin()) with check (public.esadmin());
-- Las imágenes del slider se guardan en el bucket 'products', carpeta sliders/
