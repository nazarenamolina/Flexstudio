/**
 * URL de la API. En el build es obligatoria (vite.config.ts corta el build si falta); el valor de
 * localhost solo se usa con `npm run dev`. Antes, si la variable faltaba en Vercel, el sitio se
 * publicaba apuntando a localhost y no funcionaba nada, sin ningún aviso.
 */
export const API_URL: string = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');
