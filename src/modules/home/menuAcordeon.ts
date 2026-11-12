export interface SubElementoMenu {
  etiqueta: string;
  href?: string;
}

export interface ElementoMenu {
  id: string;
  titulo: string;
  descripcion?: string;
  subelementos: SubElementoMenu[];
}

// Contenido del menú acordeón de la página principal (según docs/ABOUT.md)
export const menuAcordeon: ElementoMenu[] = [
  {
    id: "santa-hildegarda",
    titulo: "Santa Hildegarda",
    subelementos: [
      { etiqueta: "Video Podcasts sobre la Santa" },
      { etiqueta: "Biografía de la Santa" },
      { etiqueta: "Obra Musical" },
      { etiqueta: "Benedicto XVI y la Santa" },
      { etiqueta: "Fuentes oficiales católicas" },
    ],
  },
  {
    id: "nuestra-sede",
    titulo: "Nuestra Sede",
    subelementos: [{ etiqueta: "La Ermita" }, { etiqueta: "Misión" }, { etiqueta: "Visión" }],
  },
  {
    id: "tienda-virtual",
    titulo: "Nuestros productos o Tienda Virtual",
    subelementos: [
      { etiqueta: "Video Podcasts sobre los productos" },
      { etiqueta: "Catálogo de libros" },
      { etiqueta: "Catálogo de medicinas" },
      { etiqueta: "Catálogo de Bisutería", href: "/#catalogo" },
    ],
  },
  {
    id: "retiros",
    titulo: "Nuestros Retiros Espirituales",
    subelementos: [
      { etiqueta: "Video Podcasts sobre los retiros" },
      { etiqueta: "Retiros grupales" },
      { etiqueta: "Retiros individuales" },
    ],
  },
  {
    id: "glosario",
    titulo: "Glosario Hildegardiano",
    descripcion: "Palabras importantes de la vida y obra de Santa Hildegarda",
    subelementos: [],
  },
];
