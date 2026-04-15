import { api } from './axios';

export interface CheckoutPerfilData {
  documentoIdentidad?: string;
  telefono?: string;
  direccion?: string;
  provincia?: string;
  ciudad?: string;
  codigoPostal?: string;
}



export const obtenerMiPerfilRequest = async () => {
  const response = await api.get('/usuarios/me');
  return response.data;
};

export const actualizarMiPerfilRequest = async (datos: any) => {
  const response = await api.patch('/usuarios/me', datos);
  return response.data;
};

export const actualizarPerfilCheckoutRequest = async (datos: CheckoutPerfilData) => {
  const respuesta = await api.patch('/usuarios/me/checkout', datos);
  return respuesta.data;
};