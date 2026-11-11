"use client";

import { useMemo, useState, useTransition } from "react";
import type { CampoCrud, ColumnaCrud, FilaCrud, ResultadoAccion } from "@/types/crud";

interface CrudManagerProps {
  titulo: string;
  subtitulo: string;
  singular: string;
  filas: FilaCrud[];
  columnas: ColumnaCrud[];
  campos: CampoCrud[];
  guardar: (formData: FormData) => Promise<ResultadoAccion>;
  eliminar: (id: string | number) => Promise<ResultadoAccion>;
}

const formatoMoneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const estiloEntrada =
  "w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export default function CrudManager({
  titulo,
  subtitulo,
  singular,
  filas,
  columnas,
  campos,
  guardar,
  eliminar,
}: CrudManagerProps) {
  const [busqueda, setBusqueda] = useState("");
  const [registroEnEdicion, setRegistroEnEdicion] = useState<FilaCrud | null>(null);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [pendiente, iniciarTransicion] = useTransition();

  const filasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return filas;
    return filas.filter((fila) =>
      columnas.some((columna) => String(fila[columna.clave] ?? "").toLowerCase().includes(termino)),
    );
  }, [busqueda, filas, columnas]);

  // abrirFormulario: abre el formulario vacío (crear) o con los datos del registro (editar)
  const abrirFormulario = (fila: FilaCrud | null) => {
    setRegistroEnEdicion(fila);
    setMensajeError("");
    setFormularioAbierto(true);
  };

  // cerrarFormulario: cierra el formulario y limpia el estado
  const cerrarFormulario = () => {
    setFormularioAbierto(false);
    setRegistroEnEdicion(null);
  };

  // enviarFormulario: envía los datos al servidor para crear o actualizar
  const enviarFormulario = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formData = new FormData(evento.currentTarget);
    iniciarTransicion(async () => {
      const resultado = await guardar(formData);
      if (resultado.error) setMensajeError(resultado.error);
      else cerrarFormulario();
    });
  };

  // confirmarEliminacion: pide confirmación y elimina el registro
  const confirmarEliminacion = (fila: FilaCrud) => {
    if (!window.confirm(`¿Eliminar este registro de ${singular}?`)) return;
    iniciarTransicion(async () => {
      const resultado = await eliminar(fila.id);
      if (resultado.error) window.alert(resultado.error);
    });
  };

  // renderizarCelda: da formato al valor según el tipo de columna
  const renderizarCelda = (fila: FilaCrud, columna: ColumnaCrud) => {
    const valor = fila[columna.clave];
    if (columna.formato === "moneda") return formatoMoneda.format(Number(valor ?? 0));
    if (columna.formato === "booleano") return valor ? "Sí" : "No";
    if (columna.formato === "stock") {
      const unidades = Number(valor ?? 0);
      const color =
        unidades === 0
          ? "bg-error/10 text-red-700"
          : unidades <= 5
            ? "bg-secondary-container/40 text-on-secondary-container"
            : "bg-primary-container/10 text-primary";
      return (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
          {unidades} Und.
        </span>
      );
    }
    return valor === null || valor === "" ? "—" : String(valor);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-primary/10 p-4 md:p-6 shadow-[0px_10px_30px_rgba(27,73,44,0.04)]">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary">{titulo}</h1>
          <p className="text-sm text-on-surface-variant">{subtitulo}</p>
        </div>
        <button
          type="button"
          onClick={() => abrirFormulario(null)}
          className="bg-primary-container text-on-primary px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary transition-colors"
        >
          + Nuevo {singular}
        </button>
      </header>

      <input
        type="search"
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
        placeholder={`Buscar ${singular}...`}
        className={`${estiloEntrada} sm:w-72 mb-4`}
      />

      <div className="overflow-x-auto rounded-lg border border-outline-variant/30">
        <table className="w-full text-left text-sm min-w-[560px]">
          <thead className="bg-surface-container">
            <tr>
              {columnas.map((columna) => (
                <th key={columna.clave} className="p-3 font-semibold text-on-surface-variant">
                  {columna.etiqueta}
                </th>
              ))}
              <th className="p-3 text-right font-semibold text-on-surface-variant">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filasFiltradas.length === 0 && (
              <tr>
                <td colSpan={columnas.length + 1} className="p-6 text-center text-on-surface-variant">
                  No hay registros para mostrar.
                </td>
              </tr>
            )}
            {filasFiltradas.map((fila) => (
              <tr key={fila.id} className="border-t border-outline-variant/10 hover:bg-surface-container-low">
                {columnas.map((columna) => (
                  <td key={columna.clave} className="p-3 text-on-surface">
                    {renderizarCelda(fila, columna)}
                  </td>
                ))}
                <td className="p-3 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => abrirFormulario(fila)}
                    className="px-2 py-1 text-primary hover:bg-primary/5 rounded-md"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={pendiente}
                    onClick={() => confirmarEliminacion(fila)}
                    className="px-2 py-1 text-red-700 hover:bg-error/5 rounded-md disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-on-surface-variant">
        {filasFiltradas.length} de {filas.length} registros
      </p>

      {formularioAbierto && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            key={registroEnEdicion?.id ?? "nuevo"}
            onSubmit={enviarFormulario}
            className="bg-surface-container-lowest w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6 flex flex-col gap-4"
          >
            <h2 className="font-display text-xl text-primary">
              {registroEnEdicion ? "Editar" : "Nuevo"} {singular}
            </h2>
            {registroEnEdicion && <input type="hidden" name="id" value={registroEnEdicion.id} />}

            {campos.map((campo) => {
              const valorActual = registroEnEdicion?.[campo.nombre];
              return (
                <label key={campo.nombre} className="flex flex-col gap-1 text-sm text-on-surface-variant">
                  {campo.tipo === "booleano" ? (
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={campo.nombre}
                        defaultChecked={registroEnEdicion ? Boolean(valorActual) : true}
                      />
                      {campo.etiqueta}
                    </span>
                  ) : (
                    <>
                      {campo.etiqueta}
                      {campo.tipo === "area" ? (
                        <textarea
                          name={campo.nombre}
                          rows={3}
                          defaultValue={String(valorActual ?? "")}
                          className={estiloEntrada}
                        />
                      ) : campo.tipo === "seleccion" ? (
                        <select
                          name={campo.nombre}
                          defaultValue={String(valorActual ?? "")}
                          className={estiloEntrada}
                        >
                          <option value="">Sin categoría</option>
                          {campo.opciones?.map((opcion) => (
                            <option key={opcion.valor} value={opcion.valor}>
                              {opcion.etiqueta}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name={campo.nombre}
                          type={campo.tipo === "numero" ? "number" : campo.tipo === "correo" ? "email" : "text"}
                          min={campo.tipo === "numero" ? 0 : undefined}
                          step={campo.tipo === "numero" ? "any" : undefined}
                          required={campo.requerido}
                          defaultValue={valorActual === null || valorActual === undefined ? "" : String(valorActual)}
                          className={estiloEntrada}
                        />
                      )}
                    </>
                  )}
                </label>
              );
            })}

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
                disabled={pendiente}
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
