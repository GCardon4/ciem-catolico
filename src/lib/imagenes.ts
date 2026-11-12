export const ladoMaximoImagen = 1200;
export const calidadWebp = 0.82;

// convertirAWebp: reduce la imagen al lado máximo indicado (1200px por defecto) y la convierte a .webp
export const convertirAWebp = async (archivo: File, ladoMaximo = ladoMaximoImagen): Promise<File> => {
  if (!archivo.type.startsWith("image/")) throw new Error("El archivo no es una imagen");
  const mapaBits = await createImageBitmap(archivo);
  const escala = Math.min(1, ladoMaximo / Math.max(mapaBits.width, mapaBits.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(mapaBits.width * escala);
  lienzo.height = Math.round(mapaBits.height * escala);
  lienzo.getContext("2d")!.drawImage(mapaBits, 0, 0, lienzo.width, lienzo.height);
  mapaBits.close();

  const blob = await new Promise<Blob | null>((resolver) =>
    lienzo.toBlob(resolver, "image/webp", calidadWebp),
  );
  if (!blob || blob.type !== "image/webp") {
    throw new Error("Tu navegador no pudo convertir la imagen a WebP");
  }
  const nombreBase = archivo.name.replace(/\.[^.]+$/, "") || "imagen";
  return new File([blob], `${nombreBase}.webp`, { type: "image/webp" });
};
