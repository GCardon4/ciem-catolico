export interface PedidoAdmin {
  id: number;
  estado: string;
  total: number;
  fecha: string;
  cliente: { nombre: string; telefono: string; ciudad: string; direccion: string };
  items: { nombre: string; cantidad: number; precioUnitario: number; subtotal: number }[];
  pago: { estado: string; metodo: string; monto: number; moneda: string; correo: string | null } | null;
}
