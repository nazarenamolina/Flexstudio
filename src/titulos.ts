
const SEPARADOR = '|';

export const tituloVisible = (titulo: string): string =>
  titulo.split(SEPARADOR).join(' ').replace(/\s+/g, ' ').trim();
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
