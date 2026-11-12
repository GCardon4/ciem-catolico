# 🗃️ Database Schema – Sistema de Productos y Pedidos

## 📌 Propósito

Definir la estructura de la base de datos para gestionar:

* Profiles (profiles) / Usuarios
* Products (products) / Productos con nombre, sku, descripcion, precio y stock
* Category (category) / Categoría del Producto
* Images Products (images_product) /Imagenes que contiene el producto
* Customers (customers) /Clientes Pedidos
* Orders (orders) / Pedidos Realizados por los clientes
* Transactions (transactions) / Transacciones con estado de las ventas solicitadas Tipo/Carritos de venta


Este esquema soporta múltiples productos por pedido, historial de ventas y escalabilidad futura.

---

# 🧩 Entidades Principales

## 👤 profiles (Usuarios del sistema)

| Campo      | Tipo | Descripción             |
| ---------- | ---- | ----------------------- |
| id         | uuid | PK (Auth Supabase)      |
| full_name  | text | Nombre Usuario          |
| email      | text | Email del usuario       |
| role_id    | int8 | FK → roles              |
| created_at | date | Fecha de creación       |
| updated_at | date | Fecha de Actualizacion  |

---

##  roles (Usuarios del sistema)

| Campo      | Tipo | Descripción             |
| ---------- | ---- | ----------------------- |
| id         | int8 | PK                      |
| name       | text | Nombre Usuario          |
| created_at | date | Fecha de creación       |

---

## 🛍️ products

| Campo       | Tipo    | Descripción           |
| ----------- | ------- | --------------------- |
| id          | int8    | PK                    |
| name        | text    | Nombre del producto   |
| description | text    | Descripción           |
| price       | numeric | Precio actual         |
| stock       | numeric | Inventario disponible |
| category_id | int8    | FK → category         |
| created_at  | date    | Fecha de creación     |
| updated_at  | date    | Fecha de Actualizacion|

---

## 🏷️ category

| Campo       | Tipo | Descripción      |
| ----------- | ---- | ---------------- |
| id          | int8 | PK               |
| name        | text | Nombre categoría |
| description | text | Descripción      |
| created_at  | date | Fecha            |

---

## 🖼️ images_product

| Campo      | Tipo | Descripción   |
| ---------- | ---- | ------------- |
| id         | int8 | PK            |
| product_id | int8 | FK → products |
| image_url  | text | URL imagen    |
| created_at | date | Fecha         |
| main       | bool | Defaul=FALSE  |

---

## 👥 customers

| Campo      | Tipo | Descripción     |
| ---------- | ---- | --------------- |
| id         | int8 | PK              |
| full_name  | text | Nombre completo |
| phone      | text | Teléfono        |
| city       | text | Ciudad          |
| address    | text | Dirección       |
| created_at | date | Fecha           |

---

## 🧾 orders (Cabecera del pedido)

| Campo        | Tipo    | Descripción                     |
| ------------ | ------- | ------------------------------- |
| id           | int8    | PK                              |
| customer_id  | int8    | FK → customers                  |
| user_id      | uuid    | FK → profiles (opcional)        |
| status       | text    | pending / confirmed / cancelled |
| total_amount | numeric | Total del pedido                |
| created_at   | date    | Fecha                           |

---

## 🔥 order_items (Detalle del pedido) ✅ CRÍTICA

| Campo      | Tipo    | Descripción                    |
| ---------- | ------- | ------------------------------ |
| id         | int8    | PK                             |
| order_id   | int8    | FK → orders                    |
| product_id | int8    | FK → products                  |
| quantity   | numeric | Cantidad                       |
| unit_price | numeric | Precio en el momento de compra |
| subtotal   | numeric | quantity * unit_price          |
| created_at | date    | Fecha                          |

---

## 💳 transactions

| Campo          | Tipo    | Descripción                   |
| -------------- | ------- | ----------------------------- |
| id             | int8    | PK                            |
| order_id       | int8    | FK → orders                   |
| status         | text    | pending / approved / rejected |
| payment_method | text    | Método de pago                |
| amount         | numeric | Monto                         |
| created_at     | date    | Fecha                         |

---