// Slide: diapositiva del slider principal de la página de inicio
export interface Slide {
  id: number;
  titulo: string;
  subtitulo: string;
  etiquetaBoton: string;
  enlace: string;
  imagen: string;
}

// SlideAdmin: diapositiva tal como se guarda en la tabla hero_slides
export interface SlideAdmin {
  id: number;
  title: string;
  subtitle: string | null;
  button_label: string | null;
  link_url: string | null;
  image_url: string;
  position: number;
  active: boolean;
}
