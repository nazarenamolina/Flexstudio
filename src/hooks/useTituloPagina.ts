import { useEffect } from 'react';

const TITULO_SITIO = 'Flex Studio';

/** Título de la pestaña del navegador ("Puente | Flex Studio"). Al salir de la página vuelve el anterior. */
export const useTituloPagina = (titulo: string | null | undefined) => {
  useEffect(() => {
    if (!titulo) return;
    const anterior = document.title;
    document.title = `${titulo} | ${TITULO_SITIO}`;
    return () => {
      document.title = anterior;
    };
  }, [titulo]);
};
