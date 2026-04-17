import { api } from './axios';

export interface LoginCredentials {
  correo: string;
  contrasena: string;
}

export interface VerificarOtpData {
  correo: string;
  codigo: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  pais?:string;
}

export interface LoginResponse {
  mensaje: string;
  usuario: Usuario;
}

export interface RegistroData {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  fechaNacimiento?: string;
  pais?: string;
  provincia?: string;
  ciudad?: string;
  direccion?: string;
  codigoPostal?: string;
  captchaToken?: string;
}

export const registroRequest = async (datos: RegistroData) => {
  const response = await api.post('/auth/registro', datos);
  return response.data;
};

export const verificarEmailRequest = async (datos: VerificarOtpData) => {
  const response = await api.post('/auth/verificar-email', datos);
  return response.data;
};

export const loginRequest = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;  
};

export const logoutRequest = async (): Promise<{ mensaje: string }> => {
  const response = await api.post('/auth/logout');
  return response.data;
};