import { api } from './axios';

export interface ImagenGaleria {
  publicId: string;
  url: string;
  formato: string;
  fecha: string;
  ancho: number;
  alto: number;
}

export interface RespuestaGaleria {
  imagenes: ImagenGaleria[];
  nextCursor: string | null;
  total: number;
}

export const obtenerGaleriaRequest = async (cursor?: string): Promise<RespuestaGaleria> => {
  const url = cursor ? `/admin/galeria?cursor=${cursor}` : '/admin/galeria';
  const respuesta = await api.get(url);
  return respuesta.data;
};