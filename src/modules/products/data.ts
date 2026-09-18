import type { Product } from "@/types/product";

// obtenerCatalogoDestacado: retorna el pequeño catálogo de productos para la página de inicio
export const obtenerCatalogoDestacado = (): Product[] => [
  {
    id: "medalla-san-benito",
    nombre: "Medalla de San Benito",
    descripcion: "Protección tradicional labrada en plata pura con detalles precisos.",
    precio: 45,
    categoria: "Medallas",
    etiqueta: "Plata 925",
    imagen: "/images/image-01.jpg",
  },
  {
    id: "rosario-olivo",
    nombre: "Rosario de Olivo",
    descripcion: "Cuentas talladas a mano en auténtica madera de olivo de Tierra Santa.",
    precio: 32,
    categoria: "Rosarios",
    imagen: "/images/image-03.jpg",
  },
  {
    id: "cruz-minimalista",
    nombre: "Cruz Minimalista",
    descripcion: "Un diseño contemporáneo y elegante que honra la tradición con simplicidad.",
    precio: 55,
    categoria: "Cruces",
  },
  {
    id: "anillo-promesa",
    nombre: "Anillo Promesa",
    descripcion: "Bañado en oro con un sutil grabado de cruz, perfecto para uso diario.",
    precio: 89,
    categoria: "Anillos",
    etiqueta: "Nuevo",
  },
];
