export const numeroWhatsappNegocio = "573146034091";

// generarEnlaceWhatsapp: construye un enlace wa.me con un mensaje precargado opcional
export const generarEnlaceWhatsapp = (mensaje?: string): string => {
  const base = `https://wa.me/${numeroWhatsappNegocio}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
};

// normalizarTelefonoColombia: deja el teléfono solo con dígitos y el indicativo 57 de Colombia
export const normalizarTelefonoColombia = (telefono: string): string => {
  const digitos = telefono.replace(/\D/g, "");
  if (digitos.length === 10) return `57${digitos}`;
  return digitos;
};

// generarEnlaceWhatsappCliente: enlace para escribirle a un cliente con un mensaje precargado
export const generarEnlaceWhatsappCliente = (telefono: string, mensaje: string): string =>
  `https://wa.me/${normalizarTelefonoColombia(telefono)}?text=${encodeURIComponent(mensaje)}`;
