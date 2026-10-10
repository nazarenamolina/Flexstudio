import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Al cambiar de página vuelve arriba; si la URL trae un ancla (/#clases), baja hasta esa sección. */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Se baja al ancla cuando la página nueva ya está en el DOM, y otra vez un poco después porque
    // el contenido que llega del back (carrusel, clases) cambia la altura de lo que está arriba.
    const bajar = () => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    const cuadro = requestAnimationFrame(bajar);
    const reintento = setTimeout(bajar, 600);
    return () => { cancelAnimationFrame(cuadro); clearTimeout(reintento); };
  }, [pathname, hash]);
  return null;
};
