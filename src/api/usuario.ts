import { api } from './axios';

export interface CheckoutPerfilData {
  documentoIdentidad?: string;
  telefono?: string;
  direccion?: string;
  provincia?: string;
  ciudad?: string;
  codigoPostal?: string;
}



export interface ActualizarPerfilData {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  fechaNacimiento?: string;
  pais?: string;
  provincia?: string;
  ciudad?: string;
  direccion?: string;
  codigoPostal?: string;
}

export const obtenerMiPerfilRequest = async () => {
  const response = await api.get('/usuarios/me');
  return response.data;
};

export const actualizarMiPerfilRequest = async (datos: ActualizarPerfilData) => {
  const response = await api.patch('/usuarios/me', datos);
  return response.data;
};

export const actualizarPerfilCheckoutRequest = async (datos: CheckoutPerfilData) => {
  const respuesta = await api.patch('/usuarios/me/checkout', datos);
  return respuesta.data;
};