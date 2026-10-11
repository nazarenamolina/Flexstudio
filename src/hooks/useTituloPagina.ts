import { useEffect } from 'react';

const TITULO_SITIO = 'Flex Studio';

// Descripción de Google: largo recomendado. Más larga, Google la corta con "…" donde quiera.
const LARGO_DESCRIPCION = 155;

const resumir = (texto: string) => {
  const limpio = texto.replace(/\s+/g, ' ').trim();
  if (limpio.length <= LARGO_DESCRIPCION) return limpio;
  const corte = limpio.slice(0, LARGO_DESCRIPCION - 1);
  return `${corte.slice(0, corte.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`;
};

/**
 * Título de la pestaña ("Puente | Flex Studio") y, si se pasa, la descripción que muestra Google
 * debajo del título en los resultados. La de index.html es la de la home: sin esto, todas las
 * páginas tenían esa misma descripción. Al salir de la página vuelven las anteriores.
 */
export const useTituloPagina = (titulo: string | null | undefined, descripcion?: string | null) => {
  useEffect(() => {
    if (!titulo) return;
    const anterior = document.title;
    document.title = `${titulo} | ${TITULO_SITIO}`;
    return () => {
      document.title = anterior;
    };
  }, [titulo]);

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!descripcion?.trim() || !meta) return;
    const anterior = meta.content;
    meta.content = resumir(descripcion);
    return () => {
      meta.content = anterior;
    };
  }, [descripcion]);
};
