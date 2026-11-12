const formatoMoneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

// formatearPrecio: da formato de pesos colombianos a un valor numérico
export const formatearPrecio = (valor: number) => formatoMoneda.format(valor);
