import { api } from './axios';
import { type PaginacionMeta } from './admin';

export type TipoSolicitud = 'ARREPENTIMIENTO' | 'BAJA';
export type EstadoSolicitud = 'PENDIENTE' | 'RESUELTA' | 'RECHAZADA';

export interface DatosSolicitud {
  tipo: TipoSolicitud;
  nombre: string;
  correo: string;
  numeroComprobante?: string;
  detalle?: string;
  captchaToken: string;
}

export const crearSolicitudRequest = async (datos: DatosSolicitud): Promise<{ codigo: string; tipo: TipoSolicitud }> => {
  const respuesta = await api.post('/solicitudes', datos);
  return respuesta.data;
};

export interface CompraDeSolicitud {
  id: string;
  /** APROBADO, o REEMBOLSADO si ya se devolvió. */
  estado: 'APROBADO' | 'REEMBOLSADO';
  fechaReembolso: string | null;
  titulo: string;
  modulo: string | null;
  monto: number;
  moneda: string;
  plataforma: string;
  fechaPago: string;
  /** La solicitud entró dentro de los 10 días corridos desde el pago. */
  dentroDelPlazo: boolean;
  /** Número de su comprobante (FLEX-0001), si ya se generó. */
  numeroRecibo: string | null;
  /** Es la compra del comprobante que la persona escribió en el formulario. */
  esDelComprobante: boolean;
  /** Videos de ese mes iniciados hasta el momento del pedido: los que cuenta la regla. */
  videosReproducidos: number;
  /** Videos iniciados después de hacer el pedido. No cambian la regla; se muestran para decidir. */
  videosDespuesDelPedido: number;
  /** En plazo y con hasta un video iniciado de ese mes al momento del pedido. */
  cumpleRegla: boolean;
}

export interface Solicitud {
  id: string;
  codigo: string;
  tipo: TipoSolicitud;
  estado: EstadoSolicitud;
  nombre: string;
  correo: string;
  numeroComprobante: string | null;
  detalle: string | null;
  notaAdmin: string | null;
  /** Lo que se le respondió por correo al resolver o rechazar. */
  respuestaCliente: string | null;
  idCompraDevuelta: string | null;
  fechaCreacion: string;
  fechaResolucion: string | null;
  contexto: { cuentaRegistrada: boolean; compras: CompraDeSolicitud[] };
}

export interface RespuestaSolicitudes {
  data: Solicitud[];
  pendientes: number;
  meta: PaginacionMeta;
}

export const obtenerSolicitudesRequest = async (pagina: number, estado?: EstadoSolicitud, busqueda?: string, limite = 10): Promise<RespuestaSolicitudes> => {
  const respuesta = await api.get('/solicitudes', { params: { page: pagina, limit: limite, estado, busqueda: busqueda || undefined } });
  return respuesta.data;
};

/** Devuelve el pago completo de la compra, le quita el acceso, resuelve la solicitud y avisa por correo. */
export const devolverSolicitudRequest = async (id: string, idCompra: string) => {
  const respuesta = await api.post(`/solicitudes/${id}/devolver`, { idCompra });
  return respuesta.data;
};

/** Rechaza la solicitud y le manda el motivo por correo a quien la hizo. */
export const rechazarSolicitudRequest = async (id: string, mensaje: string) => {
  const respuesta = await api.post(`/solicitudes/${id}/rechazar`, { mensaje });
  return respuesta.data;
};

export const actualizarSolicitudRequest = async (id: string, cambios: { estado?: EstadoSolicitud; notaAdmin?: string }) => {
  const respuesta = await api.patch(`/solicitudes/${id}`, cambios);
  return respuesta.data;
};
