# Descripción del Proyecto
Don Peñolinni, App-web para gestión de productos, inventarios, pedidos y cocina, con un historial de cada uno de los modulos para tener una mejor administración de los pedidos, productos y ventas, controla por medio de whatsapp el acompañamiento con los clientes y los pedidos, con un diseño moderno y colores corporativos

## Características Implementadas
-	Menú Principal con Productos para selección de sabores, tamaños, variedades y demás opciones del producto (imagen menu-principal.png)
-	Modal Lateral o Ventana Emergente con el pedido seleccionado por el cliente (imagen menu-principal.png) y (imagen variedad.png)
-   Dashboard con pedidos realizados en tiempo real, estado del pedido y control para envío a cocina (imagen pedidos.png)
-	Dashboard con estadísticas de ventas, utilidades, productos más vendidos, estados y control de administración completa del negocio
-   CRUD Para creación de productos
-	Modulo de Inventario para ingreso y control de materia prima, productos
-	Modulo de Costos para ingreso de materia prima sobre los productos y utilidades de ganancias
-   Modulo de Cocina donde se encuentran los pedidos aprobados por el admin
-	Estado de tiempos en el modulo de cocina por pedido
-	Modulos de cajas, con mesas incorporadas para pedidos sobre cada sede
-	Modulo A escalar con QR desde las mesas para ordenes y pedidos sobre cada sede
-	Opcional descarga e Instalación de Aplicación sobre dispositivos móviles y windows (PWA)

## Arquitectura del Proyecto

src/
├── app/            # Routing (Next.js)
├── modules/        # Lógica por dominio
├── components/     # UI reutilizable
├── lib/            # Servicios y utilidades
├── store/          # Estado global
├── types/          # Tipos globales


 ## Roles Usuarios
 -	**Admin (Administración)**
 	* Dashboard con estadísticas completas de ventas diarias y semanales
 	* CRUD completos de Usuarios, Clientes, Productos, Categorías, Cajas, Mesas
 	* Control de Pedidos y Visualización total de los pedidos

 -	**Cashier (Caja)**
 	* Dashboard Lateral con estados de pedidos en orden
 	* Creación de Pedidos, con menú para crear un pedido y enviarlo a cocina
 	* Control de pedidos que ingresan en linea desde public, aprueba los pedidos

 -	**Cook (Cocina)**
 	* Visualización de Pedidos Creados y Aprobados
 	* Confirmar Estados de pedidos Listos (Preparación Lista)
 	* Suma de Estiramientos de pizzas (footer con tamaños y un botón de sumar)

 -	**Waiter (Mesero)**
 	* Panel Inicial con Mesas
 	* Asignación de pedido a Mesa con Menú de Productos
 	* Adición de Productos al pedido o mesa


 ## Menú Principal Dashboard

 -	Panel Principal: Estadísticas, Ventas y estados de productos
 -	Pedidos: Módulo de Pedidos realizados por clientes y cajas
 -	Productos: CRUD completo de los productos
 -	Categorías: CRUD completo de las categorias para filtración de productos
 -	Adiciones: CRUD de adiciones que se utilizan para todos los productos
 -	Mesas: CRUD completo de las mesas del negocio
 -	Cajas: CRUD de Cajas para configurar con permisos de edición
 -	Clientes: Modulo de los clientes registrados con CRUD completo, filtro que debemos realizar por teléfono o Whastapp como identificación principal del cliente
 -	Recetas: Modulo para recetas de los productos (paso ultimos a seguir)


##  Stack Tecnológico

- **Frontend**: Next.js - React
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **PWA**: Workbox (configurado)