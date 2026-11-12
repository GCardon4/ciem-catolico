// Product: producto público del catálogo, listo para mostrar en la web
export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  sku?: string;
  stock: number;
  imagen?: string;
  imagenes: string[];
}

export interface ImagenProducto {
  id: number | string;
  image_url: string;
  main?: boolean | null;
}

// ProductoAdmin: producto tal como se guarda en la tabla products, con sus imágenes
export interface ProductoAdmin {
  id: number | string;
  name: string;
  sku: string | null;
  description: string | null;
  price: number | string;
  stock: number | string;
  category_id: number | string | null;
  images_product: ImagenProducto[];
}
