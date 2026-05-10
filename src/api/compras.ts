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

export const iniciarCompraRequest = async (datosCompra: PayloadCompra) => {
  const response = await api.post('/compras/iniciar', datosCompra);
  return response.data;
};