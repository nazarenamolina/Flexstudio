// src/api/compras.ts
import { api } from './axios';

 
export interface ClaseComprada {
  id: string;
  titulo: string;
  descripcionCard?: string;
  descripcionBreve?: string;
  imagenTarjeta?: string | null;
  imagenHero?: string | null;
}

export const obtenerMisClasesCompradas = async (): Promise<ClaseComprada[]> => {
 
  const respuesta = await api.get('/compras/mis-clases');
  return respuesta.data;
};

export const obtenerDetalleClase = async (id: string) => {
  const respuesta = await api.get(`/compras/mis-clases/${id}`);
  return respuesta.data;
};