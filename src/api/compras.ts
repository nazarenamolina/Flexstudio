// src/api/compras.ts
import { api } from './axios';
import { type PayloadCompra } from '../hooks/useCheckout';

 
export interface ClaseComprada {
  id: string;
  titulo: string;
  descripcionCard?: string;
  descripcionBreve?: string;
  imagenTarjeta?: string | null;
  imagenHero?: string | null;
}

export interface DatosCompra {
  idsCategorias: string[];
}

export const obtenerMisClasesCompradas = async (): Promise<ClaseComprada[]> => {
 
  const respuesta = await api.get('/compras/mis-clases');
  return respuesta.data;
};

export const obtenerDetalleClase = async (id: string) => {
  const respuesta = await api.get(`/compras/mis-clases/${id}`);
  return respuesta.data;
};

export type EstadoCompra = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'EXPIRADO';

/** Estado real de una compra (lo actualiza el webhook de la pasarela). */
export const obtenerEstadoCompraRequest = async (grupoPagoId: string): Promise<{ estado: EstadoCompra }> => {
  const respuesta = await api.get(`/compras/estado/${grupoPagoId}`);
  return respuesta.data;
};

export type EstadoCapturaPaypal = 'APROBADO' | 'PENDIENTE' | 'NO_APROBADO' | 'RECHAZADO';

/** Cobra la orden de PayPal que el comprador acaba de aprobar (vuelve con ?token=<idOrden>). */
export const capturarPagoPaypalRequest = async (idOrden: string): Promise<{ estado: EstadoCapturaPaypal }> => {
  const respuesta = await api.post('/compras/paypal/capturar', { idOrden });
  return respuesta.data;
};

export const iniciarCompraRequest = async (datosCompra: PayloadCompra) => {
  const response = await api.post('/compras/iniciar', datosCompra);
  return response.data;
};