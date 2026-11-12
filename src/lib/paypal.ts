
const urlBase =
  process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

export class ErrorPaypal extends Error {}

// obtenerTasaCopPorUsd: pesos colombianos por cada dólar, configurable en PAYPAL_COP_POR_USD
export const obtenerTasaCopPorUsd = () => Number(process.env.PAYPAL_COP_POR_USD) || 4000;

// convertirCopAUsd: convierte pesos a dólares redondeando hacia arriba al centavo
export const convertirCopAUsd = (montoCop: number) =>
  (Math.ceil((montoCop / obtenerTasaCopPorUsd()) * 100) / 100).toFixed(2);

// obtenerTokenPaypal: solicita el token de acceso con las credenciales de la cuenta empresarial
const obtenerTokenPaypal = async () => {
  const credenciales = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");
  const respuesta = await fetch(`${urlBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credenciales}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!respuesta.ok) throw new ErrorPaypal("No se pudo autenticar con PayPal");
  return (await respuesta.json()).access_token as string;
};

// llamarPaypal: realiza una petición autenticada a la API de PayPal
const llamarPaypal = async (ruta: string, cuerpo: unknown, idempotencia?: string) => {
  const token = await obtenerTokenPaypal();
  const respuesta = await fetch(`${urlBase}${ruta}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(idempotencia ? { "PayPal-Request-Id": idempotencia } : {}),
    },
    body: JSON.stringify(cuerpo),
    cache: "no-store",
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw new ErrorPaypal(datos?.details?.[0]?.description ?? datos?.message ?? "Error de PayPal");
  return datos;
};

// crearOrdenPaypal: crea una orden de pago en USD y retorna su id
export const crearOrdenPaypal = async (montoUsd: string, referencia: string, descripcion: string) => {
  const datos = await llamarPaypal(
    "/v2/checkout/orders",
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: referencia,
          custom_id: referencia,
          description: descripcion,
          amount: { currency_code: "USD", value: montoUsd },
        },
      ],
    },
    `pedido-${referencia}`,
  );
  return datos.id as string;
};

// capturarOrdenPaypal: cobra una orden aprobada por el comprador y retorna los datos del pago
export const capturarOrdenPaypal = async (ordenId: string) => {
  const datos = await llamarPaypal(`/v2/checkout/orders/${ordenId}/capture`, {});
  const captura = datos.purchase_units?.[0]?.payments?.captures?.[0];
  return {
    completado: datos.status === "COMPLETED" && captura?.status === "COMPLETED",
    monto: Number(captura?.amount?.value ?? 0),
    moneda: (captura?.amount?.currency_code as string | undefined) ?? "",
    correoComprador: (datos.payer?.email_address as string | undefined) ?? null,
  };
};
