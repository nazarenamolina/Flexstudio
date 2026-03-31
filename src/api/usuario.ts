import { api } from './axios';

export const obtenerMiPerfilRequest = async () => {
  const response = await api.get('/usuarios/me');
  return response.data;
};

export const actualizarMiPerfilRequest = async (datos: any) => {
  const response = await api.patch('/usuarios/me', datos);
  return response.data;
};