/** Ruta interna a la que volver después del login (solo rutas del sitio, nunca otro dominio). */
export const rutaDeRetorno = (state: unknown): string | null => {
  const desde = (state as { desde?: unknown } | null)?.desde;
  return typeof desde === 'string' && desde.startsWith('/') && !desde.startsWith('//') ? desde : null;
};
