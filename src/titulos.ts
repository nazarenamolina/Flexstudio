/**
 * El admin puede marcar con "|" dónde se corta el título en el encabezado de la clase:
 * "Clases para | Gimnastas" muestra "Clases para" en cursiva y "GIMNASTAS" grande en verde.
 * Sin "|", se corta a la mitad de las palabras.
 */
const SEPARADOR = '|';

/** Título para mostrar en cualquier lugar (tarjetas, carrito, menú, pestaña): sin la barra. */
export const tituloVisible = (titulo: string): string =>
  titulo.split(SEPARADOR).join(' ').replace(/\s+/g, ' ').trim();

/** Las dos líneas del encabezado de la clase. Con una sola palabra, todo va en la línea destacada. */
export const partesDelTitulo = (titulo: string): { cursiva: string; destacada: string } => {
  if (titulo.includes(SEPARADOR)) {
    const [antes, ...despues] = titulo.split(SEPARADOR);
    const cursiva = tituloVisible(antes);
    const destacada = tituloVisible(despues.join(' '));
    return destacada ? { cursiva, destacada } : { cursiva: '', destacada: cursiva };
  }
  const palabras = titulo.trim().split(/\s+/);
  const corte = palabras.length > 1 ? Math.ceil(palabras.length / 2) : 0;
  return { cursiva: palabras.slice(0, corte).join(' '), destacada: palabras.slice(corte).join(' ') };
};
