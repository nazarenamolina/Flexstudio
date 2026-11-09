import { api } from './axios';

export type MotivoRevision = 'COBRO_DUPLICADO' | 'MONTO_DISTINTO' | 'MES_NO_DISPONIBLE' | 'REEMBOLSO_SIN_REFERENCIA' | 'COMPROBANTE_SIN_ENVIAR';

export interface PagoARevisar {
  id: string;
  motivo: MotivoRevision;
  idPago: string;
  plataforma: 'MERCADOPAGO' | 'PAYPAL';
  monto: number | null;
  moneda: string | null;
  detalle: string | null;
  fechaCreacion: string;
  cliente: { nombre: string; correo: string } | null;
}

export const obtenerPagosARevisarRequest = async (): Promise<PagoARevisar[]> => {
  const respuesta = await api.get('/compras/pagos-a-revisar');
  return respuesta.data;
};

export const resolverPagoARevisarRequest = async (id: string) => {
  const respuesta = await api.patch(`/compras/pagos-a-revisar/${id}/resolver`);
  return respuesta.data;
};
