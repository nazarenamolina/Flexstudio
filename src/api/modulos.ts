import { api } from './axios';
import { type ModuloConEstado, type ModuloPublico } from '../modulos';

export interface DatosModulo {
  numero?: number;
  titulo?: string;
  descripcion?: string;
  precioArs?: number;
  precioUsd?: number;
}

export const crearModuloRequest = async (datos: DatosModulo & { idCategoria: string }): Promise<ModuloPublico> => {
  const respuesta = await api.post('/modulos', datos);
  return respuesta.data;
};

export const actualizarModuloRequest = async (id: string, datos: DatosModulo): Promise<ModuloPublico> => {
  const respuesta = await api.patch(`/modulos/${id}`, datos);
  return respuesta.data;
};

export const eliminarModuloRequest = async (id: string): Promise<{ mensaje: string }> => {
  const respuesta = await api.delete(`/modulos/${id}`);
  return respuesta.data;
};

/** Qué puede comprar y hasta cuándo tiene acceso el usuario logueado, mes por mes. */
export const obtenerEstadosModulosRequest = async (idCategoria: string): Promise<ModuloConEstado[]> => {
  const respuesta = await api.get(`/compras/modulos/${idCategoria}`);
  return respuesta.data;
};
