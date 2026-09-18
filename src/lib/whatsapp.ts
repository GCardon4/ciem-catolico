export const numeroWhatsappNegocio = "573146034091";

// generarEnlaceWhatsapp: construye un enlace wa.me con un mensaje precargado opcional
export const generarEnlaceWhatsapp = (mensaje?: string): string => {
  const base = `https://wa.me/${numeroWhatsappNegocio}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
};
