import { Link } from 'react-router-dom';
import { RUTA_ARREPENTIMIENTO, RUTA_BAJA } from '../legal';

const claseEnlace = 'whitespace-nowrap font-semibold uppercase tracking-wide text-white underline-offset-2 transition-colors hover:text-[#d7f250] hover:underline focus-visible:outline-2 focus-visible:outline-[#d7f250]';

/**
 * La Disposición 954/2025 pide ambos botones "a simple vista, en lugar destacado y en el primer
 * acceso", por eso van arriba de todo y no solo en el footer. Mide lo mismo que el `pt-7` del
 * contenido en LayoutConNav: si cambia su alto hay que cambiar los dos.
 */
export const BarraConsumidor = () => (
  <div className="flex h-7 items-center justify-center gap-2 bg-[#131313] px-2 text-[9.5px] sm:gap-6 sm:text-[11px]">
    <Link to={RUTA_ARREPENTIMIENTO} className={claseEnlace}>Botón de arrepentimiento</Link>
    <span aria-hidden="true" className="text-white/30">|</span>
    <Link to={RUTA_BAJA} className={claseEnlace}>Botón de baja de servicio</Link>
  </div>
);
