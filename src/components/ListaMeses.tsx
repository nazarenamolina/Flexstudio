import { Link } from 'react-router-dom';
import { CalendarClock, Check, Lock, PlayCircle, ShoppingCart } from 'lucide-react';
import { useMoneda } from '../hooks/useMoneda';
import { formatearPrecio, precioEn } from '../precios';
import { formatearFecha, MESES_ACCESO, nombreModulo, type ModuloConEstado } from '../modulos';
import { PagoEnProceso } from './PagoEnProceso';

interface Props {
  idCategoria: string;
  modulos: ModuloConEstado[];
  idEnCarrito?: string;
  onAgregar: (modulo: ModuloConEstado) => void;
}

const claseBoton = 'inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-principal text-sm font-bold uppercase tracking-wide transition-colors sm:w-auto';

/** Los meses de una categoría, con el estado y la acción que corresponde a cada uno. */
export const ListaMeses = ({ idCategoria, modulos, idEnCarrito, onAgregar }: Props) => {
  const { moneda, cargandoMoneda } = useMoneda();

  return (
    <ol className="flex flex-col gap-4">
      {modulos.map((modulo) => {
        const precio = precioEn(modulo, moneda);
        const enCarrito = idEnCarrito === modulo.id;
        const bloqueado = modulo.estado === 'BLOQUEADO' || modulo.estado === 'NO_DISPONIBLE';

        return (
          <li key={modulo.id} className={`flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${bloqueado ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-300 bg-white shadow-sm'}`}>
            <div className="min-w-0">
              <h3 className={`font-principal text-xl uppercase leading-tight sm:text-2xl ${bloqueado ? 'text-neutral-500' : 'text-[#131313]'}`}>{nombreModulo(modulo)}</h3>
              {modulo.descripcion && <p className="mt-1 text-sm leading-relaxed text-neutral-600">{modulo.descripcion}</p>}
              <p className="mt-2 text-xs font-semibold text-neutral-500">
                {modulo.cantidadVideos} {modulo.cantidadVideos === 1 ? 'video' : 'videos'} · {modulo.duracionTotalFormateada}
                {modulo.terminado && <span className="ml-2 inline-flex items-center gap-1 text-[#131313]"><Check size={13} /> Terminado</span>}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
              {modulo.estado === 'VIGENTE' && (
                <>
                  <Link to={`/mis-clases/${idCategoria}`} className={`${claseBoton} bg-[#131313] text-white hover:bg-[#d7f250] hover:text-[#131313]`}>
                    <PlayCircle size={18} /> Ver videos
                  </Link>
                  {modulo.fechaVencimiento && (
                    <p className="text-center text-xs text-neutral-600 sm:text-right">Acceso hasta el {formatearFecha(modulo.fechaVencimiento)}</p>
                  )}
                </>
              )}

              {modulo.comprable && modulo.pagoEnProceso && (
                // Empezar de nuevo pasa por el carrito: ahí se elige pagar con un link nuevo.
                <PagoEnProceso idModulo={modulo.id} idCategoria={idCategoria} pago={modulo.pagoEnProceso} onEmpezarDeNuevo={enCarrito ? undefined : () => onAgregar(modulo)} />
              )}

              {modulo.comprable && !modulo.pagoEnProceso && (
                <>
                  {modulo.estado === 'VENCIDO' && modulo.fechaVencimiento && (
                    <p className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-neutral-600 sm:justify-end">
                      <CalendarClock size={13} /> Venció el {formatearFecha(modulo.fechaVencimiento)}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => onAgregar(modulo)}
                    disabled={enCarrito || cargandoMoneda || precio === null}
                    className={`${claseBoton} bg-[#d7f250] text-[#131313] hover:bg-[#131313] hover:text-white disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500`}
                  >
                    {cargandoMoneda ? 'Calculando precio…'
                      : precio === null ? 'No disponible en tu moneda'
                      : enCarrito ? <><Check size={18} /> En tu carrito</>
                      : <><ShoppingCart size={18} /> {modulo.estado === 'VENCIDO' ? 'Volver a comprar' : 'Agregar'} · {formatearPrecio(precio, moneda)}</>}
                  </button>
                  <p className="text-center text-xs text-neutral-500 sm:text-right">Acceso por {MESES_ACCESO} meses</p>
                </>
              )}

              {modulo.estado === 'VENCIDO' && !modulo.comprable && (
                <p className="text-center text-xs font-semibold text-neutral-500 sm:text-right">Venció y ya no está a la venta</p>
              )}

              {modulo.estado === 'BLOQUEADO' && (
                <p className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-neutral-500 sm:justify-end">
                  <Lock size={15} /> Se habilita al terminar el Mes {modulo.requiereNumero}
                </p>
              )}

              {modulo.estado === 'NO_DISPONIBLE' && (
                <p className="text-center text-sm font-semibold text-neutral-500 sm:text-right">Próximamente</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};
