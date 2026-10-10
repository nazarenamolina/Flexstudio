import * as z from 'zod';

/**
 * Regla de contraseña del sitio: la misma que POLITICA_CONTRASENA del back
 * (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/, máximo 50). Antes estaba repetida en el
 * registro y en la nueva contraseña, con mensajes distintos en cada pantalla.
 */
export const REQUISITOS_CONTRASENA = [
  { id: 'largo', texto: 'Al menos 6 caracteres', cumple: (v: string) => v.length >= 6 },
  { id: 'mayuscula', texto: 'Una mayúscula', cumple: (v: string) => /[A-Z]/.test(v) },
  { id: 'minuscula', texto: 'Una minúscula', cumple: (v: string) => /[a-z]/.test(v) },
  { id: 'numero', texto: 'Un número', cumple: (v: string) => /\d/.test(v) },
  { id: 'simbolo', texto: 'Un símbolo (por ejemplo # ! @ .)', cumple: (v: string) => /[\W_]/.test(v) },
] as const;

export const esquemaContrasena = z
  .string()
  .max(50, 'La contraseña no puede superar los 50 caracteres')
  .refine((v) => REQUISITOS_CONTRASENA.every((r) => r.cumple(v)), 'La contraseña no cumple todos los requisitos');
