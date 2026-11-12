"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { convertirAWebp } from "@/lib/imagenes";
import type { ResultadoAccion } from "@/types/crud";
import type { SlideAdmin } from "@/types/slide";

interface SliderManagerProps {
  slides: SlideAdmin[];
  guardar: (formData: FormData) => Promise<ResultadoAccion>;
  eliminar: (id: string | number) => Promise<ResultadoAccion>;
}

const ladoMaximoSlider = 1920;

const estiloEntrada =
  "w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export default function SliderManager({ slides, guardar, eliminar }: SliderManagerProps) {
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [slide, setSlide] = useState<SlideAdmin | null>(null);
  const [imagenNueva, setImagenNueva] = useState<{ archivo: File; vistaPrevia: string } | null>(null);
  const [mensajeError, setMensajeError] = useState("");
  const [convirtiendo, setConvirtiendo] = useState(false);
  const [pendiente, iniciarTransicion] = useTransition();

  // liberarVistaPrevia: libera la memoria de la vista previa de la imagen nueva
  const liberarVistaPrevia = () => {
    if (imagenNueva) URL.revokeObjectURL(imagenNueva.vistaPrevia);
    setImagenNueva(null);
  };

  // abrirFormulario: abre el formulario para crear (null) o editar una diapositiva
  const abrirFormulario = (item: SlideAdmin | null) => {
    liberarVistaPrevia();
    setSlide(item);
    setMensajeError("");
    setFormularioAbierto(true);
  };

  // cerrarFormulario: cierra el formulario y libera recursos
  const cerrarFormulario = () => {
    liberarVistaPrevia();
    setFormularioAbierto(false);
    setSlide(null);
  };

  // seleccionarImagen: convierte la imagen elegida a .webp (máx. 1920 px) y muestra la vista previa
  const seleccionarImagen = async (evento: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!archivo) return;
    setConvirtiendo(true);
    setMensajeError("");
    try {
      const webp = await convertirAWebp(archivo, ladoMaximoSlider);
      liberarVistaPrevia();
      setImagenNueva({ archivo: webp, vistaPrevia: URL.createObjectURL(webp) });
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : "No se pudo procesar la imagen");
    } finally {
      setConvirtiendo(false);
    }
  };

  // enviarFormulario: guarda la diapositiva con su imagen
  const enviarFormulario = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formData = new FormData(evento.currentTarget);
    if (imagenNueva) formData.set("archivo", imagenNueva.archivo);
    iniciarTransicion(async () => {
      const resultado = await guardar(formData);
      if (resultado.error) setMensajeError(resultado.error);
      else cerrarFormulario();
    });
  };

  // confirmarEliminacion: pide confirmación y elimina la diapositiva
  const confirmarEliminacion = (item: SlideAdmin) => {
    if (!window.confirm(`¿Eliminar la diapositiva "${item.title}"?`)) return;
    iniciarTransicion(async () => {
      const resultado = await eliminar(item.id);
      if (resultado.error) window.alert(resultado.error);
    });
  };

  const vistaPrevia = imagenNueva?.vistaPrevia ?? slide?.image_url;

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-primary/10 p-4 md:p-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary">Slider principal</h1>
          <p className="text-sm text-on-surface-variant">
            Diapositivas de la página de inicio · imagen recomendada 1920×800 px (se convierte a .webp)
          </p>
        </div>
        <button
          type="button"
          onClick={() => abrirFormulario(null)}
          className="bg-primary-container text-on-primary px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary transition-colors"
        >
          + Nueva diapositiva
        </button>
      </header>

      {slides.length === 0 ? (
        <p className="text-center text-on-surface-variant py-10">
          Aún no hay diapositivas. Mientras no haya ninguna activa, la página muestra la portada de siempre.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {slides.map((item) => (
            <li key={item.id} className="rounded-xl border border-outline-variant/30 overflow-hidden flex flex-col">
              <div className="relative aspect-[16/7] bg-surface-container">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
                <span
                  className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.active ? "bg-primary text-on-primary" : "bg-black/60 text-white"
                  }`}
                >
                  {item.active ? "Activa" : "Oculta"} · Orden {item.position}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-1 flex-1">
                <p className="font-semibold text-primary">{item.title}</p>
                {item.subtitle && <p className="text-sm text-on-surface-variant line-clamp-2">{item.subtitle}</p>}
                {item.link_url && (
                  <p className="text-xs text-on-surface-variant truncate">
                    {item.button_label || "Botón"} → {item.link_url}
                  </p>
                )}
                <div className="flex gap-2 mt-auto pt-3">
                  <button
                    type="button"
                    onClick={() => abrirFormulario(item)}
                    className="px-3 py-1.5 text-sm text-primary hover:bg-primary/5 rounded-md"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={pendiente}
                    onClick={() => confirmarEliminacion(item)}
                    className="px-3 py-1.5 text-sm text-red-700 hover:bg-error/5 rounded-md disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {formularioAbierto && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center sm:p-4">
          <form
            key={slide?.id ?? "nuevo"}
            onSubmit={enviarFormulario}
            className="bg-surface-container-lowest w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6 flex flex-col gap-4"
          >
            <h2 className="font-display text-xl text-primary">
              {slide ? "Editar diapositiva" : "Nueva diapositiva"}
            </h2>
            {slide && <input type="hidden" name="id" value={slide.id} />}

            <div className="flex flex-col gap-2">
              <p className="text-sm text-on-surface-variant">Imagen</p>
              <label className="relative block aspect-[16/7] rounded-lg border-2 border-dashed border-outline-variant overflow-hidden cursor-pointer hover:bg-surface-container">
                {vistaPrevia ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={vistaPrevia} alt="Vista previa" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-sm text-on-surface-variant">
                    {convirtiendo ? "Procesando..." : "+ Subir imagen"}
                  </span>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={seleccionarImagen} disabled={convirtiendo} />
              </label>
              {imagenNueva && (
                <p className="text-xs text-on-surface-variant">
                  Convertida a .webp · {Math.round(imagenNueva.archivo.size / 1024)} KB
                </p>
              )}
            </div>

            <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
              Título
              <input name="title" required defaultValue={slide?.title ?? ""} className={estiloEntrada} />
            </label>
            <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
              Subtítulo
              <textarea name="subtitle" rows={2} defaultValue={slide?.subtitle ?? ""} className={estiloEntrada} />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
                Texto del botón
                <input name="button_label" defaultValue={slide?.button_label ?? ""} className={estiloEntrada} />
              </label>
              <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
                Enlace del botón
                <input
                  name="link_url"
                  placeholder="/#catalogo o https://..."
                  defaultValue={slide?.link_url ?? ""}
                  className={estiloEntrada}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
                Orden (menor primero)
                <input name="position" type="number" defaultValue={slide?.position ?? slides.length + 1} className={estiloEntrada} />
              </label>
              <label className="flex items-center gap-2 text-sm text-on-surface-variant sm:pt-6">
                <input type="checkbox" name="active" defaultChecked={slide ? slide.active : true} />
                Visible en la página
              </label>
            </div>

            {mensajeError && <p className="text-sm text-red-700">{mensajeError}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={cerrarFormulario}
                className="px-4 py-2 rounded-full border border-outline-variant text-sm text-on-surface-variant hover:bg-surface-container"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={pendiente || convirtiendo}
                className="px-5 py-2 rounded-full bg-primary-container text-on-primary text-sm font-semibold hover:bg-primary disabled:opacity-50"
              >
                {pendiente ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
