import { useEffect, useSyncExternalStore } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import {
  aceptarCookies, analyticsDisponible, leerEleccion, rechazarCookies, registrarPagina, suscribirEleccion,
} from '../analytics';

/**
 * Aviso de cookies (Google Analytics) y registro de visitas por página. El aviso aparece hasta que
 * la persona elige; "Preferencias de cookies" en el footer lo vuelve a mostrar. En el panel admin
 * no se muestra ni se mide: las visitas de la administradora no son visitas de alumnas.
 */
export const AvisoCookies = () => {
  const { pathname } = useLocation();
  const eleccion = useSyncExternalStore(suscribirEleccion, leerEleccion, () => null);
  const esAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  // Una visita por cambio de ruta. Se espera un instante para que la página ya tenga su título.
  useEffect(() => {
    if (esAdmin || eleccion !== 'aceptadas') return;
    const espera = setTimeout(() => registrarPagina(pathname), 300);
    return () => clearTimeout(espera);
  }, [pathname, esAdmin, eleccion]);

  if (!analyticsDisponible() || eleccion !== null || esAdmin) return null;

  return (
    <section
      role="region"
      aria-label="Aviso de cookies"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-50 rounded-2xl border border-neutral-200 bg-white p-5 text-[#131313] shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
    >
      <div className="flex items-start gap-3">
        <Cookie className="w-5 h-5 shrink-0 mt-0.5 text-[#131313]" aria-hidden="true" />
        <p className="text-sm text-neutral-700 leading-relaxed">
          Usamos Google Analytics para saber cómo se usa el sitio y mejorarlo. Solo se activa si aceptás.{' '}
          <Link to="/politica-de-privacidad" className="font-semibold text-[#131313] underline decoration-[#d7f250] decoration-2 underline-offset-2">
            Más información
          </Link>
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={rechazarCookies}
          className="flex-1 rounded-full border border-neutral-300 px-4 py-2.5 text-sm font-bold text-[#131313] transition-colors hover:bg-neutral-100"
        >
          Rechazar
        </button>
        <button
          type="button"
          onClick={aceptarCookies}
          className="flex-1 rounded-full bg-[#d7f250] px-4 py-2.5 text-sm font-bold text-[#131313] transition-colors hover:bg-[#131313] hover:text-white"
        >
          Aceptar
        </button>
      </div>
    </section>
  );
};
