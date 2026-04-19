 
import { api } from './axios'; // Asegúrate de que la ruta a tu instancia de axios sea la correcta

export const enviarConsultaRequest = async (data: { nombre: string; correo: string; mensaje: string; captchaToken: string }) => {
  const response = await api.post('/contacto', data);
  return response.data;
};