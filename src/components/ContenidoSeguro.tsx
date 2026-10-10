import { Suspense, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { LimiteDeError } from './LimiteDeError';

/** Mientras se descarga una pantalla. */
const CargandoPantalla = ({ oscuro }: { oscuro: boolean }) => (
  <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Cargando">
    <Loader2 className={`w-9 h-9 animate-spin ${oscuro ? 'text-[#d7f250]' : 'text-[#131313]'}`} />
  </div>
);

/**
 * Carga diferida y error de una pantalla: el resto del layout (header, footer, barra del admin)
 * sigue visible mientras se descarga o si falla. Cambiar de ruta limpia el error.
 */
export const ContenidoSeguro = ({ children, oscuro = false }: { children: ReactNode; oscuro?: boolean }) => {
  const { pathname } = useLocation();
  return (
    <LimiteDeError variante={oscuro ? 'oscuro' : 'claro'} claveReinicio={pathname}>
      <Suspense fallback={<CargandoPantalla oscuro={oscuro} />}>{children}</Suspense>
    </LimiteDeError>
  );
};
