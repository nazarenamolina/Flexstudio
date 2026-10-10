import { isAxiosError } from 'axios';

/**
 * Mensaje legible de un error de la API. El back responde `message` como texto o, en los errores de
 * validación, como lista ("El nombre es obligatorio", "El teléfono no es válido"…): se unen con punto.
 * Sin respuesta (red caída, servidor apagado) se usa `porDefecto`.
 */
export const mensajeDeError = (error: unknown, porDefecto: string): string => {
  // El límite de pedidos (Throttler) responde en inglés ("Too Many Requests").
  if (isAxiosError(error) && error.response?.status === 429) {
    return 'Hiciste demasiados intentos seguidos. Esperá un minuto y volvé a probar.';
  }
  const mensaje = isAxiosError(error) ? error.response?.data?.message : undefined;
  if (Array.isArray(mensaje)) return mensaje.filter(Boolean).join('. ') || porDefecto;
  return typeof mensaje === 'string' && mensaje.trim() ? mensaje : porDefecto;
};

/** Datos extra de la respuesta de error (por ejemplo `requiereVerificacion` en el login). */
export const datosDeError = (error: unknown): Record<string, unknown> | undefined =>
  isAxiosError(error) && error.response?.data && typeof error.response.data === 'object'
    ? (error.response.data as Record<string, unknown>)
    : undefined;
