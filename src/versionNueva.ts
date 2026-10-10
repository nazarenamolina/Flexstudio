// Después de cada deploy, quien tenía la pestaña abierta pide partes del sitio que ya no existen
// (los archivos llevan un hash en el nombre). Se recarga una vez para traer la versión nueva.

// Marca de la última recarga automática: si el archivo sigue sin aparecer, no se recarga en bucle.
const CLAVE_RECARGA = 'flex-recarga-por-version';
const ESPERA_ENTRE_RECARGAS_MS = 60_000;

/** Error al descargar una parte del sitio (versión vieja ya borrada del servidor). */
export const esErrorDeVersion = (error: unknown) =>
  error instanceof Error &&
  /dynamically imported module|Importing a module script failed|error loading dynamically imported|Unable to preload CSS/i.test(error.message);

/** Recarga la página una vez para traer la versión nueva. Devuelve false si ya se intentó hace poco. */
export const recargarPorVersionNueva = () => {
  try {
    const ultima = Number(sessionStorage.getItem(CLAVE_RECARGA) || 0);
    if (Date.now() - ultima < ESPERA_ENTRE_RECARGAS_MS) return false;
    sessionStorage.setItem(CLAVE_RECARGA, String(Date.now()));
  } catch {
    // Sin sessionStorage (modo privado estricto): se recarga igual.
  }
  window.location.reload();
  return true;
};
