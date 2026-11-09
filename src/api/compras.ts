// src/api/compras.ts
import { api } from './axios';
import { type PayloadCompra } from '../hooks/useCheckout';
import { type ModuloConEstado } from '../modulos';


export interface ClaseComprada {
  id: string;
  titulo: string;
  descripcionCard?: string;
  descripcionBreve?: string;
  imagenTarjeta?: string | null;
  imagenHero?: string | null;
  modulos?: ModuloConEstado[];
}

export const obtenerMisClasesCompradas = async (): Promise<ClaseComprada[]> => {
 
  const respuesta = await api.get('/compras/mis-clases');
  return respuesta.data;
};

export const obtenerDetalleClase = async (id: string) => {
  const respuesta = await api.get(`/compras/mis-clases/${id}`);
  return respuesta.data;
};

export type EstadoCompra = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'EXPIRADO' | 'REEMBOLSADO';

/** Estado real de una compra (lo actualiza el webhook de la pasarela). */
export const obtenerEstadoCompraRequest = async (grupoPagoId: string): Promise<{ estado: EstadoCompra }> => {
  const respuesta = await api.get(`/compras/estado/${grupoPagoId}`);
  return respuesta.data;
};

export type EstadoCapturaPaypal = 'APROBADO' | 'PENDIENTE' | 'NO_APROBADO' | 'RECHAZADO' | 'VENCIDO' | 'YA_TIENE_ACCESO';

/** Cobra la orden de PayPal que el comprador acaba de aprobar (vuelve con ?token=<idOrden>). */
export const capturarPagoPaypalRequest = async (idOrden: string): Promise<{ estado: EstadoCapturaPaypal }> => {
  const respuesta = await api.post('/compras/paypal/capturar', { idOrden });
  return respuesta.data;
};

/** El link de pago, o `yaPagado` si un pago anterior de ese mes se acreditó al revisarlo. */
export type RespuestaInicioCompra =
  | { url: string; plataforma: string; idPagoExterno: string }
  | { yaPagado: true; idCategoria: string };

export const iniciarCompraRequest = async (datosCompra: PayloadCompra): Promise<RespuestaInicioCompra> => {
  const response = await api.post('/compras/iniciar', datosCompra);
  return response.data;
};

/**
 * "Ya pagué, verificar": el back le pregunta a la pasarela por los links recientes de ese mes.
 * `automatico` (la que hace la página sola) nunca cobra una orden de PayPal aprobada y sin cobrar.
 */
export const verificarPagoModuloRequest = async (idModulo: string, automatico = false): Promise<{ estado: 'APROBADO' | 'EN_REVISION' | 'SIN_PAGO' }> => {
  const respuesta = await api.post(`/compras/modulos/${idModulo}/verificar`, undefined, { params: automatico ? { automatico: 1 } : undefined });
  return respuesta.data;
};