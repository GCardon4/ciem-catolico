"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { convertirAWebp } from "@/lib/imagenes";
import type { ResultadoAccion } from "@/types/crud";
import type { ProductoAdmin } from "@/types/product";

interface ProductosManagerProps {
  productos: ProductoAdmin[];
  categorias: { id: number | string; name: string }[];
  guardar: (formData: FormData) => Promise<ResultadoAccion>;
  eliminar: (id: string | number) => Promise<ResultadoAccion>;
  subirImagen: (productoId: string | number, formData: FormData) => Promise<ResultadoAccion>;
  eliminarImagen: (imagenId: string | number) => Promise<ResultadoAccion>;
  marcarPrincipal: (productoId: string | number, imagenId: string | number) => Promise<ResultadoAccion>;
}

type SeleccionPrincipal =
  | { tipo: "actual"; id: number | string }
  | { tipo: "nueva"; indice: number }
  | null;

interface ImagenNueva {
  archivo: File;
  vistaPrevia: string;
}

const maximoImagenes = 5;

const formatoMoneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const estiloEntrada =
  "w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export default function ProductosManager({
  productos,
  categorias,
  guardar,
  eliminar,
  subirImagen,
  eliminarImagen,
  marcarPrincipal,
}: ProductosManagerProps) {
  const [principal, setPrincipal] = useState<SeleccionPrincipal>(null);
  const [busqueda, setBusqueda] = useState("");
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [producto, setProducto] = useState<ProductoAdmin | null>(null);
  const [imagenesNuevas, setImagenesNuevas] = useState<ImagenNueva[]>([]);
  const [imagenesQuitadas, setImagenesQuitadas] = useState<(number | string)[]>([]);
  const [mensajeError, setMensajeError] = useState("");
  const [convirtiendo, setConvirtiendo] = useState(false);
  const [pendiente, iniciarTransicion] = useTransition();

  const nombresCategoria = useMemo(
    () => new Map(categorias.map((categoria) => [String(categoria.id), categoria.name])),
    [categorias],
  );

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return productos;
    return productos.filter((item) =>
      [item.name, item.sku, nombresCategoria.get(String(item.category_id))]
        .some((valor) => (valor ?? "").toLowerCase().includes(termino)),
    );
  }, [busqueda, productos, nombresCategoria]);

  // La imagen marcada como principal va primero; el resto por orden de creación
  const ordenarImagenes = (lista: ProductoAdmin["images_product"]) =>
    [...lista].sort((a, b) => Number(!!b.main) - Number(!!a.main) || Number(a.id) - Number(b.id));

  const imagenesActuales = ordenarImagenes(producto?.images_product ?? []).filter(
    (imagen) => !imagenesQuitadas.includes(imagen.id),
  );

  // obtenerPrincipalEfectivo: resuelve cuál imagen será la principal según la selección y lo disponible
  const obtenerPrincipalEfectivo = (): SeleccionPrincipal => {
    if (principal?.tipo === "actual" && imagenesActuales.some((imagen) => imagen.id === principal.id)) {
      return principal;
    }
    if (principal?.tipo === "nueva" && principal.indice < imagenesNuevas.length) return principal;
    if (imagenesActuales.length) return { tipo: "actual", id: imagenesActuales[0].id };
    if (imagenesNuevas.length) return { tipo: "nueva", indice: 0 };
    return null;
  };
  const principalEfectivo = obtenerPrincipalEfectivo();

  // abrirFormulario: abre el formulario para crear (null) o editar un producto
  const abrirFormulario = (item: ProductoAdmin | null) => {
    setProducto(item);
    setPrincipal(null);
    setImagenesNuevas([]);
    setImagenesQuitadas([]);
    setMensajeError("");
    setFormularioAbierto(true);
  };

  // cerrarFormulario: cierra el formulario y libera las vistas previas
  const cerrarFormulario = () => {
    imagenesNuevas.forEach((imagen) => URL.revokeObjectURL(imagen.vistaPrevia));
    setImagenesNuevas([]);
    setFormularioAbierto(false);
    setProducto(null);
  };

  // seleccionarImagenes: convierte las imágenes elegidas a .webp y las agrega a la lista
  const seleccionarImagenes = async (evento: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(evento.target.files ?? []);
    evento.target.value = "";
    const cupo = maximoImagenes - imagenesActuales.length - imagenesNuevas.length;
    if (archivos.length > cupo) setMensajeError(`Máximo ${maximoImagenes} imágenes por producto`);
    setConvirtiendo(true);
    try {
      const convertidas: ImagenNueva[] = [];
      for (const archivo of archivos.slice(0, Math.max(cupo, 0))) {
        const webp = await convertirAWebp(archivo);
        convertidas.push({ archivo: webp, vistaPrevia: URL.createObjectURL(webp) });
      }
      setImagenesNuevas((valorActual) => [...valorActual, ...convertidas]);
    } catch (error) {
      setMensajeError(error instanceof Error ? error.message : "No se pudo procesar la imagen");
    } finally {
      setConvirtiendo(false);
    }
  };

  // quitarImagenNueva: descarta una imagen aún no subida
  const quitarImagenNueva = (indice: number) => {
    URL.revokeObjectURL(imagenesNuevas[indice].vistaPrevia);
    setPrincipal((valorActual) => {
      if (valorActual?.tipo !== "nueva") return valorActual;
      if (valorActual.indice === indice) return null;
      return valorActual.indice > indice ? { tipo: "nueva", indice: valorActual.indice - 1 } : valorActual;
    });
    setImagenesNuevas((valorActual) => valorActual.filter((_, posicion) => posicion !== indice));
  };

  // enviarFormulario: guarda los datos, elimina las imágenes quitadas y sube las nuevas
  const enviarFormulario = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formData = new FormData(evento.currentTarget);
    iniciarTransicion(async () => {
      const resultado = await guardar(formData);
      if (resultado.error || resultado.id === undefined) {
        setMensajeError(resultado.error ?? "No se pudo guardar el producto");
        return;
      }
      for (const imagenId of imagenesQuitadas) {
        const respuesta = await eliminarImagen(imagenId);
        if (respuesta.error) {
          setMensajeError(respuesta.error);
          return;
        }
      }
      if (principalEfectivo?.tipo === "actual") {
        const respuesta = await marcarPrincipal(resultado.id, principalEfectivo.id);
        if (respuesta.error) {
          setMensajeError(respuesta.error);
          return;
        }
      }
      for (const [indice, imagen] of imagenesNuevas.entries()) {
        const datosImagen = new FormData();
        datosImagen.set("archivo", imagen.archivo);
        const esPrincipal = principalEfectivo?.tipo === "nueva" && principalEfectivo.indice === indice;
        datosImagen.set("principal", esPrincipal ? "1" : "0");
        const respuesta = await subirImagen(resultado.id, datosImagen);
        if (respuesta.error) {
          setMensajeError(`Producto guardado, pero falló una imagen: ${respuesta.error}`);
          return;
        }
      }
      cerrarFormulario();
    });
  };

  // confirmarEliminacion: pide confirmación y elimina el producto
  const confirmarEliminacion = (item: ProductoAdmin) => {
    if (!window.confirm(`¿Eliminar "${item.name}" y sus imágenes?`)) return;
    iniciarTransicion(async () => {
      const resultado = await eliminar(item.id);
      if (resultado.error) window.alert(resultado.error);
    });
  };

  // obtenerPrimeraImagen: retorna la URL de la imagen principal del producto
  const obtenerPrimeraImagen = (item: ProductoAdmin) =>
    ordenarImagenes(item.images_product)[0]?.image_url;

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-primary/10 p-4 md:p-6 shadow-[0px_10px_30px_rgba(27,73,44,0.04)]">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary">Productos</h1>
          <p className="text-sm text-on-surface-variant">Catálogo, precios, inventario e imágenes</p>
        </div>
        <button
          type="button"
          onClick={() => abrirFormulario(null)}
          className="bg-primary-container text-on-primary px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary transition-colors"
        >
          + Nuevo producto
        </button>
      </header>

      <input
        type="search"
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
        placeholder="Buscar por nombre, SKU o categoría..."
        className={`${estiloEntrada} sm:w-80 mb-4`}
      />

      <div className="overflow-x-auto rounded-lg border border-outline-variant/30">
        <table className="w-full text-left text-sm min-w-[680px]">
          <thead className="bg-surface-container">
            <tr>
              {["Imagen", "Nombre", "SKU", "Categoría", "Stock", "Precio", "Acciones"].map((titulo) => (
                <th
                  key={titulo}
                  className={`p-3 font-semibold text-on-surface-variant ${titulo === "Acciones" ? "text-right" : ""}`}
                >
                  {titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-on-surface-variant">
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
            {productosFiltrados.map((item) => {
              const imagen = obtenerPrimeraImagen(item);
              const unidades = Number(item.stock);
              const colorStock =
                unidades === 0
                  ? "bg-error/10 text-red-700"
                  : unidades <= 5
                    ? "bg-secondary-container/40 text-on-secondary-container"
                    : "bg-primary-container/10 text-primary";
              return (
                <tr key={item.id} className="border-t border-outline-variant/10 hover:bg-surface-container-low">
                  <td className="p-3">
                    {imagen ? (
                      <Image
                        src={imagen}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded object-cover border border-outline-variant/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-surface-container border border-outline-variant/20 flex items-center justify-center text-xs text-outline">
                        Sin foto
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium text-on-surface">{item.name}</td>
                  <td className="p-3 text-on-surface-variant">{item.sku || "—"}</td>
                  <td className="p-3 text-on-surface-variant">
                    {nombresCategoria.get(String(item.category_id)) ?? "—"}
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${colorStock}`}>
                      {unidades} Und.
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">{formatoMoneda.format(Number(item.price))}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => abrirFormulario(item)}
                      className="px-2 py-1 text-primary hover:bg-primary/5 rounded-md"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      disabled={pendiente}
                      onClick={() => confirmarEliminacion(item)}
                      className="px-2 py-1 text-red-700 hover:bg-error/5 rounded-md disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-on-surface-variant">
        {productosFiltrados.length} de {productos.length} productos
      </p>

      {formularioAbierto && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center sm:p-4">
          <form
            key={producto?.id ?? "nuevo"}
            onSubmit={enviarFormulario}
            className="bg-surface-container-lowest w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6 flex flex-col gap-4"
          >
            <h2 className="font-display text-xl text-primary">
              {producto ? "Editar producto" : "Nuevo producto"}
            </h2>
            {producto && <input type="hidden" name="id" value={producto.id} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-sm text-on-surface-variant sm:col-span-2">
                Nombre
                <input name="name" required defaultValue={producto?.name ?? ""} className={estiloEntrada} />
              </label>
              <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
                SKU
                <input name="sku" defaultValue={producto?.sku ?? ""} className={estiloEntrada} />
              </label>
              <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
                Categoría
                <select
                  name="category_id"
                  defaultValue={producto?.category_id ? String(producto.category_id) : ""}
                  className={estiloEntrada}
                >
                  <option value="">Sin categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={String(categoria.id)}>
                      {categoria.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
                Precio (COP)
                <input
                  name="price"
                  type="number"
                  min={0}
                  step="any"
                  required
                  defaultValue={producto?.price ?? ""}
                  className={estiloEntrada}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
                Stock
                <input
                  name="stock"
                  type="number"
                  min={0}
                  step="any"
                  required
                  defaultValue={producto?.stock ?? ""}
                  className={estiloEntrada}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-on-surface-variant sm:col-span-2">
                Descripción
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={producto?.description ?? ""}
                  className={estiloEntrada}
                />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-on-surface-variant">
                Imágenes ({imagenesActuales.length + imagenesNuevas.length}/{maximoImagenes}) · se convierten
                a .webp (máx. 1200 px). Toca la estrella para elegir la imagen principal (la del catálogo).
              </p>
              <div className="flex flex-wrap gap-3">
                {imagenesActuales.map((imagen) => (
                  <div key={imagen.id} className="relative w-24 h-24">
                    <Image
                      src={imagen.image_url}
                      alt="Imagen del producto"
                      fill
                      sizes="96px"
                      className="rounded-lg object-cover border border-outline-variant/30"
                    />
                    <button
                      type="button"
                      aria-label="Marcar como principal"
                      onClick={() => setPrincipal({ tipo: "actual", id: imagen.id })}
                      className={`absolute bottom-1 left-1 w-6 h-6 rounded-full text-sm ${
                        principalEfectivo?.tipo === "actual" && principalEfectivo.id === imagen.id
                          ? "bg-secondary-container text-secondary"
                          : "bg-black/50 text-white"
                      }`}
                    >
                      ★
                    </button>
                    <button
                      type="button"
                      aria-label="Quitar imagen"
                      onClick={() => setImagenesQuitadas((valorActual) => [...valorActual, imagen.id])}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-700 text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {imagenesNuevas.map((imagen, indice) => (
                  <div key={imagen.vistaPrevia} className="relative w-24 h-24">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagen.vistaPrevia}
                      alt="Vista previa"
                      className="w-24 h-24 rounded-lg object-cover border-2 border-secondary"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">
                      {Math.round(imagen.archivo.size / 1024)} KB
                    </span>
                    <button
                      type="button"
                      aria-label="Marcar como principal"
                      onClick={() => setPrincipal({ tipo: "nueva", indice })}
                      className={`absolute bottom-1 left-1 w-6 h-6 rounded-full text-sm ${
                        principalEfectivo?.tipo === "nueva" && principalEfectivo.indice === indice
                          ? "bg-secondary-container text-secondary"
                          : "bg-black/50 text-white"
                      }`}
                    >
                      ★
                    </button>
                    <button
                      type="button"
                      aria-label="Descartar imagen"
                      onClick={() => quitarImagenNueva(indice)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-700 text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {imagenesActuales.length + imagenesNuevas.length < maximoImagenes && (
                  <label className="w-24 h-24 rounded-lg border-2 border-dashed border-outline-variant flex items-center justify-center text-center text-xs text-on-surface-variant cursor-pointer hover:bg-surface-container">
                    {convirtiendo ? "Procesando..." : "+ Agregar"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={seleccionarImagenes}
                      disabled={convirtiendo}
                    />
                  </label>
                )}
              </div>
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
